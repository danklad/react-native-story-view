import React, { useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Metrics } from '../../theme';
import { useStoryContainer } from './hooks';
import ProgressView from './ProgressView';
import StoryView from './StoryView';
import styles from './styles';
import { ClickPosition, StoryContainerProps } from './types';

const StoryContainer = ({
  headerComponent,
  customView,
  footerComponent,
  enableProgress = true,
  headerViewProps,
  customViewProps,
  footerViewProps,
  progressViewProps,
  storyContainerViewProps,
  ...props
}: StoryContainerProps) => {
  const {
    progressIndex,
    isPause,
    isLoaded,
    duration,
    opacity,
    onImageLoaded,
    onVideoLoaded,
    changeStory,
    setLoaded,
    setDuration,
    onArrowClick,
    onStoryPressHold,
    isKeyboardVisible,
    onStoryPressRelease,
    rootStyle,
    containerStyle,
  } = useStoryContainer(props);

  const viewRef = useRef<View>(null);

  useEffect(() => {
    setLoaded(false);
    setDuration(
      props.stories?.[progressIndex]?.duration ?? Metrics.defaultDuration
    );
  }, [progressIndex, props.stories, setDuration, setLoaded]);

  const storyViewContent = () => {
    return (
      <>
        <View
          onLayout={({ nativeEvent }) => {
            if (isKeyboardVisible) return;
            const { height } = nativeEvent.layout;
            viewRef?.current?.setNativeProps({ height });
          }}
          style={props.containerStyle ?? styles.parentView}
          {...storyContainerViewProps}>
          <TouchableOpacity
            activeOpacity={1}
            delayLongPress={200}
            onPress={(e: { nativeEvent: any }) => changeStory(e.nativeEvent)}
            onLongPress={onStoryPressHold}
            onPressOut={onStoryPressRelease}>
            <StoryView
              viewRef={viewRef}
              stories={props.stories}
              duration={duration}
              onVideoLoaded={onVideoLoaded}
              onImageLoaded={onImageLoaded}
              progressIndex={progressIndex}
              imageStyle={props.imageStyle}
              pause={isPause}
            />
          </TouchableOpacity>
          {enableProgress && (
            <View
              style={[styles.progressView, { opacity }]}
              {...progressViewProps}>
              <ProgressView
                next={() => onArrowClick(ClickPosition.Right)}
                isLoaded={isLoaded}
                duration={duration}
                pause={!enableProgress && isPause}
                stories={props.stories}
                currentIndex={progressIndex}
                barStyle={props.barStyle}
                currentStory={props.stories[progressIndex]}
                length={props.stories.map((_, i) => i)}
                progress={{ id: progressIndex }}
              />
            </View>
          )}
          {headerComponent && (
            <View style={[styles.topView, { opacity }]} {...headerViewProps}>
              {headerComponent}
            </View>
          )}
          {customView && (
            <View style={[styles.customView, { opacity }]} {...customViewProps}>
              {customView}
            </View>
          )}
        </View>
        {footerComponent && (
          <View style={[styles.bottomView, { opacity }]} {...footerViewProps}>
            {footerComponent}
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={rootStyle}>
      <KeyboardAvoidingView
        style={containerStyle}
        behavior={Metrics.isIOS ? 'padding' : undefined}>
        {props.visible && storyViewContent()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default StoryContainer;