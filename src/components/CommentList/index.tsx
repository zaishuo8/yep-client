import React from 'react';
import {View, TouchableOpacity, Text, ViewStyle} from 'react-native';
import {Color} from '../../config/color_yep';
import {PostingHotComment} from '../../api/request/posting';

interface Props {
  comments: PostingHotComment[];
  style?: ViewStyle;
  onCommentPress?: (comment: PostingHotComment) => void;
}

export default class Index extends React.PureComponent<Props> {
  render() {
    const {comments, style, onCommentPress} = this.props;
    return (
      <View style={style}>
        {comments.map(comment => {
          return (
            <Comment
              key={comment.id.toString()}
              style={{paddingVertical: 2}}
              comment={comment}
              onPress={onCommentPress}
            />
          );
        })}
      </View>
    );
  }
}

interface CommentProps {
  comment: PostingHotComment;
  onPress?: (comment: PostingHotComment) => void;
  style?: ViewStyle;
}

export class Comment extends React.PureComponent<CommentProps> {
  render() {
    const {onPress, comment, style} = this.props;
    const {name, content} = comment;
    return (
      <TouchableOpacity
        style={style}
        onPress={() => {
          onPress && onPress(comment);
        }}>
        <Text
          style={{
            lineHeight: 18,
            fontSize: 14,
            color: Color.primary,
            fontWeight: 'bold',
          }}>
          {name}&nbsp;&nbsp;
          <Text style={{fontWeight: 'normal'}}>{content}</Text>
        </Text>
      </TouchableOpacity>
    );
  }
}
