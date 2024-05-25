import {
  QuerySearchType,
  QuerySortType,
} from '../../../base/adapters/query/types';
import { WithId } from 'mongodb';
import { UserType } from '../../users/api/models/output/output';
import { UserOutputModelMapper } from '../../users/api/models/output/user.output.model';
import { SORT } from '../../users/infrastructure/users.query-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogOutputModelMapper } from '../api/models/output/blog.output.model';
import { BlogTypeCreate } from '../api/models/input/input';
import { BlogTypeOutput } from '../api/models/output/output';
@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
  async getAllBlogs(sortData: QuerySortType, searchData: QuerySearchType) {
    let sortKey = {};
    let searchKey = {};

    // check have search terms create search keys array
    const searchKeysArray: any[] = [];
    if (searchData.searchNameTerm)
      searchKeysArray.push({
        name: { $regex: searchData.searchNameTerm, $options: 'i' },
      });

    if (searchKeysArray.length === 0) {
      searchKey = {};
    } else if (searchKeysArray.length === 1) {
      searchKey = searchKeysArray[0];
    } else if (searchKeysArray.length > 1) {
      searchKey = { $or: searchKeysArray };
    }
    // calculate limits for DB request
    const documentsTotalCount = await this.blogModel.countDocuments(searchKey); // Receive total count of blogs
    const pageCount = Math.ceil(documentsTotalCount / +sortData.pageSize); // Calculate total pages count according to page size
    const skippedDocuments = (+sortData.pageNumber - 1) * +sortData.pageSize; // Calculate count of skipped docs before requested page

    // check have fields exists assign the same one else assign "createdAt" value
    if (sortData.sortBy === 'name')
      sortKey = { login: SORT[sortData.sortDirection] };
    else if (sortData.sortBy === 'email')
      sortKey = { email: SORT[sortData.sortDirection] };
    else sortKey = { createdAt: SORT[sortData.sortDirection] };

    // Get documents from DB
    const blogs: WithId<BlogTypeCreate>[] = await this.blogModel
      .find(searchKey)
      .sort(sortKey)
      .skip(+skippedDocuments)
      .limit(+sortData.pageSize)
      .lean();

    return {
      pagesCount: pageCount,
      page: +sortData.pageNumber,
      pageSize: +sortData.pageSize,
      totalCount: documentsTotalCount,
      items: blogs.map(BlogOutputModelMapper),
    };
  }
  async findBlogById(blogId: string): Promise<BlogTypeOutput> {
    try {
      const result = await this.blogModel.findById({ _id: blogId });
      if (!result) throw new NotFoundException('Blog not found');
      return BlogOutputModelMapper(result);
    } catch (error) {
      throw new NotFoundException('Blog not found');
    }
  }
}
