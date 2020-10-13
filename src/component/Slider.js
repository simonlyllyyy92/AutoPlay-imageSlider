/** @jsx jsx */
import React, { useState } from 'react'
import { css, jsx } from '@emotion/core'
import SliderContent from './SliderContent'
import Slide from './Slide'
import Arrow from './Arrow'
import Dots from './Dots'

/**
 * @function Slider
 */

const Slider = ({slides}) => {
  const getWidth = () => window.innerWidth

  const [state, setState] = useState({
    activeIndex: 0,
    translate: 0,
    transition: 0.45
  })

  const { translate, transition, activeIndex } = state

  const nextSlide = () => {
    if(activeIndex === slides.length - 1){
      return setState({
        ...state,
        activeIndex: 0,
        translate: 0
      })
    }

    setState({
      ...state,
      activeIndex: activeIndex + 1,
      translate: (activeIndex + 1) * getWidth()
    })
  }

  const prevSlide = () => {
    if(activeIndex === 0){
      return setState({
        ...state,
        translate: (slides.length-1) * getWidth(),
        activeIndex: slides.length - 1
      })
    }

    setState({
      ...state,
      translate: (activeIndex - 1) * getWidth(),
      activeIndex: activeIndex - 1
    })

  }

  return (
    <div css={SliderCSS}>
      <SliderContent
        translate={translate}
        transition={transition}
        width={getWidth() * slides.length}
      >
        {slides.map(item => <Slide key={item} content={item}/>)}
        {/* */}
      </SliderContent>
      <Arrow direction = "left" handleClick = {prevSlide}/>
      <Arrow direction = "right" handleClick = {nextSlide}/>
      <Dots slides={slides} activeIndex={activeIndex}/>
    </div>
  )
}

const SliderCSS = css`
  position: relative;
  height: 100vh;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
`
export default Slider