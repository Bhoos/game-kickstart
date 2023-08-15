import { Card } from '@bhoos/cards';
import * as _cardAssets from '../assets/cards/default/index';
import React, { useState } from 'react';
import { ImageStyle, ImageURISource, Platform, View } from 'react-native';
import { Attribute, CapturableAttribute, TouchListener, timingAnim } from '@bhoos/game-kit-ui';
import { CaptureContext } from '@bhoos/game-kit-ui';
import { CapturableZIndex } from '@bhoos/game-kit-ui';
import { springAnim } from '@bhoos/game-kit-ui';
import { interpolateDegrees } from '@bhoos/game-kit-ui';
import { Sprite2D } from './Sprite2D';
import { Animated } from 'react-native';
const cardAssets = _cardAssets.default;
const glowAsset = require('../assets/cards/icons/glow.png');
/*
 *  Card Image Source
 */

export function cardImageSourceDefault(card: Card) {
  return card.isNone() ? cardAssets['back'] : cardAssets[card.code];
}

let cardImageSource = (card: Card): ImageURISource | number => {
  return cardImageSourceDefault(card);
};

export function setCardImageSource(f: (card: Card) => ImageURISource | number) {
  cardImageSource = f;
}
/*
 *  Card Sprite
 */

export interface CardDragHandlers {
  onDragStart: (ctx: CaptureContext) => void;
  onDragEnd: (ctx: CaptureContext) => void;
}

export class CardSprite extends Sprite2D {
  // 3D attributes
  readonly rotationX = new Attribute(0);
  readonly rotationY = new Attribute(0);

  // Override 2D attributes
  readonly x = new CapturableAttribute(320);
  readonly y = new CapturableAttribute(200);
  readonly zIndex = new CapturableZIndex();
  readonly glowOpacity = new Attribute(0);

  private style: Animated.WithAnimatedObject<ImageStyle> = {
    position: 'absolute',
    width: 70,
    height: 100,
    backfaceVisibility: 'hidden',
    opacity: this.opacity.animated,
    transform: [
      { perspective: 900 },
      { translateX: this.x.animated },
      { translateY: this.y.animated },
      { translateY: 200 },
      { rotateX: interpolateDegrees(this.rotationX.animated) },
      { translateY: -200 },
      { rotateY: interpolateDegrees(this.rotationY.animated) },
      { rotateZ: interpolateDegrees(this.rotation.animated) },
      { scaleX: this.scale.animated },
      { scaleY: this.scale.animated },
    ],
  };

  private _prevCard: Card;
  private _nextCard: Card;

  get card() {
    return this._nextCard;
  }

  get width() {
    return 70 * this.scale.value;
  }

  get height() {
    return 100 * this.scale.value;
  }

  constructor(card: Card) {
    super();
    this._prevCard = card;
    this._nextCard = card;
  }

  /*
   * <Interaction>
   */
  // Draggable Interface Implementation
  isDragEnabled: boolean = false;
  private _isDragging: boolean = false;
  private dragReleased: boolean = false;
  touchListener: TouchListener | null = null;

  readonly onTouch = (ctx: CaptureContext) => {
    if (!this.isDragEnabled) return null;

    const offsetX = ctx.locationX - 35;
    const offsetY = ctx.locationY - 80;
    const setDX = this.x.capture(0);
    const setDY = this.y.capture(offsetY);

    this.zIndex.capture(2000);
    this.dragReleased = false;
    this._isDragging = true;
    this.touchListener?.onTouch(ctx);
    return {
      onUpdate: (ctx: CaptureContext) => {
        if (this.dragReleased) return;
        setDX(ctx.dx);
        setDY(ctx.dy);
        this.touchListener?.onUpdate(ctx);
      },

      onEnd: (ctx: CaptureContext) => {
        this._isDragging = false;
        this.releaseDrag();
        this.touchListener?.onEnd(ctx);
      },
    };
  };

  releaseDrag() {
    this.dragReleased = true;
    this.x.release(springAnim());
    this.y.release(springAnim());
    this.zIndex.release();
  }

  // </Interaction>

  /*
   * Rendering and Flipping Card
   */

  private changeCard?: () => void;

  async flipTo(card: Card, duration: number = 300) {
    if (this._nextCard === card) return;
    this._nextCard = card;
    if (this.changeCard) {
      this.changeCard();
      await this.rotationY.animateTo(180, timingAnim({ duration: duration, useNativeDriver: true }));
      this._prevCard = card;
      this.changeCard();
      this.rotationY.setValue(0);
    } else {
      this._prevCard = card;
    }
  }

  reactComponent(props: {}) {
    const [counter, setCounter] = useState(0);
    this.changeCard = () => setCounter(counter + 1);

    let child;
    if (this._nextCard === this._prevCard) {
      child = (
        <>
          <Animated.Image key={this._nextCard.id} style={this.style} source={cardImageSource(this._nextCard)} />
        </>
      );
    } else {
      const backStyle = Object.assign({}, this.style);
      const transforms = this.style.transform as Array<any>;
      backStyle.transform = transforms.slice(0);
      backStyle.transform.push({ rotateY: '180deg' });
      if (Platform.OS == 'android') {
        backStyle.opacity = this.rotationY.animated.interpolate({
          inputRange: [89, 90],
          outputRange: [0, 1],
        });
      }
      child = (
        <>
          <Animated.Image key={this._prevCard.id} style={this.style} source={cardImageSource(this._prevCard)} />
          <Animated.Image key={this._nextCard.id} style={backStyle} source={cardImageSource(this._nextCard)} />
        </>
      );
    }

    return (
      <View
        ref={this.zIndex.ref}
        {...props}
        shouldRasterizeIOS
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        pointerEvents="box-none"
      >
        {child}
        <Animated.Image
          key={'glow'}
          style={{
            position: 'absolute',
            width: 78,
            height: 110,
            opacity: this.glowOpacity.animated,
            transform: this.style.transform,
          }}
          source={glowAsset}
        />
      </View>
    );
  }
}
