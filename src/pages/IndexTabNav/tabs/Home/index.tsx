import 'react-native-gesture-handler';

import React, {RefObject} from 'react';
import {FlatList, Text, TextInput, TouchableOpacity, View} from 'react-native';
import CustomHeader from '../../../../components/CustomHeader';
import {AppStateInterface} from '../../../../store';
import {connect} from 'react-redux';
import {OssProgressComponent} from '../../../../components/AliyunOSS';
import {OssState} from '../../../../store/oss/reducers';
import {
  CommentType, getOnePosting,
  getPostings,
  GetPostingsResult,
  Posting,
  submitComment,
} from '../../../../api/request/posting';
import Avatar from '../../../../components/Avatar';
import {Color} from '../../../../config/color_yep';
import emitter, {CustomEvent} from '../../../../components/Fbemitter';
import OnKeyboard from '../../../../components/OnKeyboard';
import {UserState} from '../../../../store/user/reducers';
import PostingItem from './components/PostingItem';

interface Props {
  oss: OssState;
  user: UserState;
}

interface State {
  postingList: Posting[];
  pageNo: number;
  pageSize: number;
  hasNext: boolean;
  refreshing: boolean;
  commentText: string;
  commentingPosting?: Posting; // 正在被评论的帖子
}

class Index extends React.PureComponent<Props, State> {
  state: State = {
    postingList: [],
    pageNo: 1,
    pageSize: 5,
    hasNext: true,
    refreshing: false,
    commentText: '',
    commentingPosting: undefined,
  };

  flatListRef: RefObject<FlatList<any>> = React.createRef();

  loadingPage: boolean = false;

  commentTextInputRef: RefObject<TextInput> = React.createRef();

  renderPostingItem = (params: {item: Posting}) => {
    const {id} = params.item;
    return (
      <PostingItem
        ref={c => (this[`postingItem_${id}`] = c)}
        posting={params.item}
        onCommentPress={this.onCommentPress}
      />
    );
  };

  renderPostingList = () => {
    return (
      <FlatList
        ref={this.flatListRef}
        data={this.state.postingList}
        renderItem={this.renderPostingItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={this.onEndReached}
        refreshing={this.state.refreshing}
        onRefresh={this.fresh}
        extraData={this.state}
      />
    );
  };

  commentInputFocus = () => {
    this.commentTextInputRef.current &&
      this.commentTextInputRef.current.focus();
  };

  onCommentPress = (posting: Posting) => {
    this.setState(
      {
        commentingPosting: posting,
        commentText: '',
      },
      this.commentInputFocus,
    );
  };

  onSubmitComment = async () => {
    const {commentText, commentingPosting} = this.state;
    if (commentText && commentingPosting) {
      const {id} = commentingPosting;
      // 提交接口
      await submitComment({
        type: CommentType.Posting,
        postingId: id,
        content: commentText,
      });
      // 置空评论框
      this.setState({
        commentText: '',
        commentingPosting: undefined,
      });
      // 更新帖子 item
      const postingNewItem = await getOnePosting({postingId: id});
      this[`postingItem_${id}`].updatePosting(postingNewItem);
      // 收起评论面板
      this.commentTextInputRef.current &&
        this.commentTextInputRef.current.blur();
    }
  };

  renderCommentArea = () => {
    const {avatars} = this.props.user;
    const {commentText, commentingPosting} = this.state;
    return (
      <OnKeyboard>
        <View
          style={{
            backgroundColor: Color.bgPrimary,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <View style={{alignSelf: 'flex-end'}}>
            <Avatar uri={avatars} size={36} />
          </View>
          <View
            style={{
              marginLeft: 12,
              flex: 1,
              maxHeight: 100,
              borderRadius: 18,
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: Color.splitLine1,
              paddingVertical: 8,
              paddingHorizontal: 12,
            }}>
            <TextInput
              style={{
                paddingTop: 0,
                flex: 1,
                lineHeight: 20,
                fontSize: 16,
                color: Color.primary,
              }}
              ref={this.commentTextInputRef}
              multiline={true}
              numberOfLines={5}
              placeholder={`回复${commentingPosting &&
                commentingPosting.userInfo.name}:`}
              value={commentText}
              onChangeText={text => this.setState({commentText: text})}
            />
            <TouchableOpacity
              onPress={this.onSubmitComment}
              style={{
                paddingLeft: 4,
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  height: 20,
                  lineHeight: 20,
                  fontSize: 16,
                  color: commentText ? Color.statusBlue : Color.statusBlue4,
                }}>
                发布
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </OnKeyboard>
    );
  };

  render() {
    const {uploading, cover} = this.props.oss;
    return (
      <View style={{flex: 1}}>
        <CustomHeader />
        {uploading && <OssProgressComponent cover={cover} />}
        {this.renderPostingList()}
        {this.renderCommentArea()}
      </View>
    );
  }

  loadOnePage = async (pageNo: number): Promise<GetPostingsResult> => {
    this.loadingPage = true;
    const result = await getPostings({
      pageNo,
      pageSize: this.state.pageSize,
    });
    this.loadingPage = false;
    return result;
  };

  loadNextPage = async () => {
    const result = await this.loadOnePage(this.state.pageNo + 1);
    if (result) {
      const {list, pageNo, pageSize, hasNext} = result;
      this.setState({
        postingList: this.state.postingList.concat(list),
        pageNo,
        pageSize,
        hasNext,
      });
    }
  };

  fresh = async (needLoading: boolean = true) => {
    if (needLoading) this.setState({refreshing: true});
    try {
      const result = await this.loadOnePage(1);
      if (result) {
        const {list, pageSize, hasNext} = result;
        this.setState({
          postingList: list,
          pageNo: 1,
          pageSize,
          hasNext,
          refreshing: false,
        });
      } else {
        this.setState({refreshing: false});
      }
    } catch (e) {
      console.error(e);
      this.setState({refreshing: false});
    }
  };

  onEndReached = async () => {
    if (this.state.hasNext && !this.loadingPage) {
      await this.loadNextPage();
    }
  };

  async componentDidMount() {
    await this.fresh();
    // @ts-ignore 设置刷新监听
    this.listener = emitter.addListener(CustomEvent.HomeFresh, async () => {
      this.flatListRef.current &&
        this.flatListRef.current.scrollToIndex({index: 0, animated: false});
      await this.fresh(false);
    });
  }

  componentWillUnmount(): void {
    // @ts-ignore
    this.listener && this.listener.remove();
  }
}

const mapStateToProps = (state: AppStateInterface) => ({
  oss: state.oss,
  user: state.user,
});

export default connect(mapStateToProps)(Index);
