import {get, post} from '../../lib/net';
import config, {api} from '../config';
import {Media} from '../../components/MdeiaList';
import {PaginationInput, PaginationOutput} from '../types/pagination';

export interface Community {
  id: number;
  name: string;
  img: string;
}

export interface SubmitPostingBody {
  medias: Media[];
  content: string;
  communityId: number;
  cityCode?: string;
  longitude?: number;
  latitude?: number;
  address?: string;
}

export interface PostingUserInfo {
  id: number;
  name: string;
  avatars: string;
}

export interface PostingCommunityInfo {
  id: number;
  name: number;
}

export interface PostingCityInfo {
  id: number;
  cityCode: string;
  name: string;
}

export interface PostingHotComment {
  id: number;
  userId: number;
  name: string;
  content: string;
}

export interface Posting {
  id: number;
  content: string;
  longitude: number;
  latitude: number;
  address: string;
  createdAt: string;
  totalCommentsNum: number;
  totalThumbsNum: number;
  hasThumb: boolean;
  hasCollection: boolean;
  userInfo: PostingUserInfo;
  medias: Media[];
  communityInfo: PostingCommunityInfo;
  cityInfo: PostingCityInfo;
  hotComments: PostingHotComment[];
}

export interface GetPostingsResult extends PaginationOutput {
  list: Posting[];
}

export enum CommentType {
  Posting = '1',
  Comment = '2',
}

/**
 * 提交帖子
 * */
export async function submitPosting(body: SubmitPostingBody): Promise<boolean> {
  try {
    return await post(`${config.host}${api.submitPosting}`, body);
  } catch (e) {
    throw e;
  }
}

/**
 * 获取帖子
 * */
export async function getPostings(
  query: PaginationInput,
): Promise<GetPostingsResult> {
  try {
    return await get(`${config.host}${api.getPostings}`, query);
  } catch (e) {
    throw e;
  }
}

/**
 * 获取单个帖子
 * */
export async function getOnePosting(query: {
  postingId: number;
}): Promise<Posting> {
  try {
    return await get(`${config.host}${api.getOnePosting}`, query);
  } catch (e) {
    throw e;
  }
}

/**
 * 回复
 * */
export async function submitComment(body: {
  type: CommentType;
  postingId: number;
  commentId?: number;
  content: string;
}) {
  try {
    return await post(`${config.host}${api.submitComment}`, body);
  } catch (e) {
    throw e;
  }
}
