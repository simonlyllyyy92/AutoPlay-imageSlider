/** @jsx jsx */
import React, { useState, useEffect, useRef } from 'react'
import { css, jsx } from '@emotion/core'
import SliderContent from './SliderContent'
import Slide from './Slide'
import Arrow from './Arrow'
import Dots from './Dots'


const getWidth = () => window.innerWidth
/**
 * @function Slider
 */

const Slider = ({slides, autoPlay, is_auto}) => {

  const firstSlide = slides[0]
  const secondSlide = slides[1]
  const lastSlide = slides[slides.length - 1]

  const [state, setState] = useState({
    activeSlide: 0,
    translate: getWidth(),
    transition: 0.45,
    _slides:[lastSlide, firstSlide, secondSlide]
  })

  const { translate, transition, activeSlide, _slides } = state

  const autoPlayRef = useRef()
  const transitionRef = useRef()
  const resizeRef = useRef()

  useEffect(() => {
    autoPlayRef.current = nextSlide
    transitionRef.current = smoothTransition
    resizeRef.current = handleResize
  })

  useEffect(() => {
    const smooth = (e) => {
      if(e.target.className.includes('SliderContent')){
        transitionRef.current()
      }
    }
    const resize = () => {
      resizeRef.current()
    }
    const transitionEnd = window.addEventListener('transitionend', smooth)
    const onResize = window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('transitionend', transitionEnd)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    let interval = null
    const play = () => {
      autoPlayRef.current()
    }
    if(is_auto){
      interval = setInterval(play, autoPlay * 1000)
    }

    return () => clearInterval(interval)
  }, [is_auto])


  const smoothTransition = () => {
    let _slides = []
    console.log('smooth')
    // We're at the last slide.
    if (activeSlide === slides.length - 1)
      _slides = [slides[slides.length - 2], lastSlide, firstSlide]
    // We're back at the first slide. Just reset to how it was on initial render
    else if (activeSlide === 0) _slides = [lastSlide, firstSlide, secondSlide]
    // Create an array of the previous last slide, and the next two slides that follow it.
    else _slides = slides.slice(activeSlide - 1, activeSlide + 2)

    setState({
      ...state,
      _slides,
      transition: 0,
      translate: getWidth()
    })
  }

  useEffect(() => {
    if (transition === 0) setState({ ...state, transition: 0.45 })
  }, [transition])

  const handleResize = () => {
    setState({ ...state, translate: getWidth(), transition: 0 })
  }
  const nextSlide = () =>
    setState({
      ...state,
      translate: translate + getWidth(),
      activeSlide: activeSlide === slides.length - 1 ? 0 : activeSlide + 1
    })

  const prevSlide = () =>
    setState({
      ...state,
      translate: 0,
      activeSlide: activeSlide === 0 ? slides.length - 1 : activeSlide - 1
    })


  return (
    <div css={SliderCSS}>
      <SliderContent
        translate={translate}
        transition={transition}
        width={getWidth() * _slides.length}
      >
        {_slides.map(item => <Slide key={item} content={item}/>)}
        {/* */}
      </SliderContent>
      {
        !is_auto && (
          <>
            <Arrow direction = "left" handleClick = {prevSlide}/>
            <Arrow direction = "right" handleClick = {nextSlide}/>
          </>
        )
      }
      <Dots slides={slides} activeSlide={activeSlide}/>
    </div>
  )
}

Slider.defaultProps = {
  slides:[],
  autoPlay:null
}

const SliderCSS = css`
  position: relative;
  height: 100vh;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
`
export default Slider