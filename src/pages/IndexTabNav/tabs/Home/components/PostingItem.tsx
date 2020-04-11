import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Color} from '../../../../../config/color_yep';
import Avatar from '../../../../../components/Avatar';
import Icon from '../../../../../components/Icon';
import Swiper from 'react-native-swiper';
import {SCREEN_WIDTH} from '../../../../../const/screen';
import {SingleMediaDisplay} from '../../../../../components/MdeiaList';
import CommentList, {Comment} from '../../../../../components/CommentList';
import {Posting} from '../../../../../api/request/posting';

interface Props {
  posting: Posting;
  onCommentPress: (posting: Posting) => void;
}

interface State {
  posting: Posting;
  onCommentPress: (posting: Posting) => void;
}

class Index extends React.PureComponent<Props> {
  state: State = {
    posting: this.props.posting,
    onCommentPress: this.props.onCommentPress,
  };

  updatePosting = (posting: Posting) => {
    this.setState({posting});
  };

  render() {
    const {posting, onCommentPress} = this.state;
    const {
      id,
      userInfo,
      medias,
      hasThumb,
      hasCollection,
      content,
      totalCommentsNum,
      hotComments,
    } = posting;
    const {avatars, name, id: userId} = userInfo;
    return (
      <View
        style={{
          marginBottom: 8,
          backgroundColor: Color.bgPrimary,
          paddingBottom: 12,
        }}>
        <View
          style={{
            flexDirection: 'row',
            padding: 6,
            alignItems: 'center',
          }}>
          <Avatar uri={avatars} />
          <Text
            numberOfLines={1}
            style={{
              height: 16,
              lineHeight: 16,
              fontSize: 12,
              color: Color.primary,
              fontWeight: 'bold',
              marginHorizontal: 8,
              flex: 1,
            }}>
            {name}
          </Text>
          <TouchableOpacity
            style={{
              height: 24,
              borderRadius: 12,
              paddingHorizontal: 6,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Color.statusBlue4,
            }}>
            <Icon name={'plus-blue'} size={10} />
            <Text
              style={{
                marginLeft: 2,
                height: 12,
                lineHeight: 12,
                fontSize: 10,
                color: Color.statusBlue,
              }}>
              关注
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingLeft: 10}}>
            <Icon name={'more-black'} size={24} />
          </TouchableOpacity>
        </View>
        <Swiper style={{height: SCREEN_WIDTH}} showsButtons={false}>
          {medias &&
            medias.length > 0 &&
            medias.map((media, index) => {
              return (
                <SingleMediaDisplay
                  size={SCREEN_WIDTH}
                  key={index.toString()}
                  media={media}
                  resize={SCREEN_WIDTH}
                />
              );
            })}
        </Swiper>
        <View style={{padding: 8}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity>
              <Icon
                name={hasThumb ? 'favorites-fill-red' : 'favorites-black'}
                size={32}
                style={{marginRight: 6}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onCommentPress(posting)}>
              <Icon
                name={'comment-black'}
                size={24}
                style={{marginHorizontal: 6}}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon
                name={
                  hasCollection ? 'collection-fill-yellow' : 'collection-black'
                }
                size={32}
                style={{marginHorizontal: 8}}
              />
            </TouchableOpacity>
          </View>
        </View>
        {!!content && (
          <View style={{paddingHorizontal: 12}}>
            <Comment comment={{id, name, userId, content}} />
          </View>
        )}
        {!!totalCommentsNum && totalCommentsNum > 0 && (
          <Text
            style={{
              marginVertical: 4,
              marginHorizontal: 12,
              lineHeight: 18,
              fontSize: 14,
              color: Color.fontGray,
            }}>
            共{totalCommentsNum}条评论
          </Text>
        )}
        {hotComments && hotComments.length > 0 && (
          <View style={{paddingHorizontal: 12}}>
            <CommentList comments={hotComments} />
          </View>
        )}
      </View>
    );
  }
}

export default Index;
