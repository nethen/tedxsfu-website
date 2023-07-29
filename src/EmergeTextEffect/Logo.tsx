import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useContainerScroll } from "@/component/ScrollContainer";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useBoundingBox } from "@/hooks/useBoundingBox";
import { MotionValue, motion, useMotionValue, useTransform } from "framer-motion";

type Props = {};

const distSq = (x1: number, y1: number, x2: number, y2: number) => {
  return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
};

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);


const LogoAnimationContext = createContext<MotionValue>(new MotionValue());

const AnimatedPath = (props: any) => {
  const mousePos = useMousePosition();
  const viewport = useWindowDimension();
  const [progress, setProgress] = useState(0);
  // const pathRef = useRef<HTMLElement>();
  const globalProgress = useContext(LogoAnimationContext);

  const [pathRef, bounds] = useBoundingBox([]);
  const origin = useMemo(()=> {
    return {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    }
  }, [bounds]);

  useEffect(() => {
    const maxDistSq = Math.min(70000, viewport.width * 32);
    const distanceSq = distSq(origin.x, origin.y, mousePos.x, mousePos.y);
    const clampedProgress = clamp(distanceSq / maxDistSq, 0, 1);
    setProgress(clampedProgress);
    // console.log(scrollY.get());
  }, [origin, mousePos]);

  const animatedProgress = useTransform(globalProgress,(val:number) => 
    (Math.sin(val*.2 + bounds.y*0.01 + bounds.x *0.005) + 1)/2  
  );
  const animatedStrokeWidth = useTransform(animatedProgress, (val:number)=>{
      return (clamp(progress - val, 0,1)) * 8 + "px";
    })


  // useEffect(()=> {
  //   const cleanup = globalProgress.on("change", (val)=>{
  //     const v = (Math.sin(val*.4) + 1)/2;
  //     console.log(v)
  //     setProgress(v);
  //   })

  //   return ()=>{
  //     cleanup();
  //   }
  // },[])

  // reverse
  const strokeWidth = (1 - progress) * 2;

  // reverse
  // const strokeWidth = (1 - (1 - progress)) * 2;


  return (

    <motion.path
      ref={pathRef}
      // strokeWidth={strokeWidth}
      strokeWidth={animatedStrokeWidth}
      stroke={"black"}
      style={{
        opacity: strokeWidth > 2 ? 0.3 : 1,
        // transitionProperty: "stroke-width, opacity",
        // transitionDuration: ".4s",
        // transitionDuration: ".3s",
        // transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        // strokeWidth: animatedStrokeWidth
      }}
      {...props}
    />
  );
};

const Logo = (props: Props) => {
  const animProgress = useMotionValue(0);

  useEffect(()=>{
    let prevTouch = 0;
    let touchDelta = 0;

    const handleTouchMove = (e:TouchEvent) => {
      const currTouch = e.touches[0].clientY;
      touchDelta = currTouch - prevTouch;
      prevTouch = currTouch;
      
      animProgress.set(animProgress.get() + touchDelta * .1);
      
      // e.preventDefault();
      // e.stopPropagation();
    }

    let animFrame = 0;
    function frameUpdate() {
      animProgress.set(animProgress.get() - .2);
      animFrame = requestAnimationFrame(frameUpdate)
    }
    animFrame = requestAnimationFrame(frameUpdate)

    const handleTouchStart = (e:TouchEvent) => {
      const currTouch = e.touches[0].clientY;
      touchDelta = 0;
      prevTouch = currTouch;
    }
    const handleTouchEnd = (e:TouchEvent) => {

    }

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return ()=>{
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animFrame);
    }
  },[])

  return (
    <LogoAnimationContext.Provider value={animProgress}>
      <svg
        style={{
          maxWidth: 'min(90vw, 36rem)'
        }}
        className="fill-white"
        // width="363"
        // height="303"
        viewBox="0 0 363 303"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <AnimatedPath 
          d="M72.3848 20.1C72.0848 14.3 69.9848 7 62.8848 6.7L57.8848 6.5V6H72.8848V61.1L36.5848 96H0.384766V95.5C5.38477 95.5 10.0848 92.7 15.1848 78.5L36.5848 18.3C38.8848 11.9 39.0848 7 34.0848 6.7L30.3848 6.5V6H41.4848L16.8848 78.6C12.0848 92.8 16.3848 93.5 21.3848 93.5H25.3848C34.0848 93.5 37.5848 93.7 56.5848 75.8C70.9848 62.1 72.0848 50.4 72.0848 42.9L72.3848 20.1Z" 
          />
        <AnimatedPath 
          d="M104.875 6L135.375 56V88.6H134.875C134.875 69.7 134.175 66.4 130.875 57.3C127.175 47.1 113.175 22.6 109.075 16.9C105.375 11.7 103.475 6.5 87.275 6.5V6H104.875ZM62.875 96V95.5C67.875 95.5 72.575 92.6 77.675 78.5L101.475 11.7H102.075L79.375 78.6C74.475 92.8 78.875 95.5 83.875 95.5V96H62.875ZM117.875 6.5V6H135.375V48.5H134.875C134.875 43.4 134.675 19.5 133.875 13.5C133.475 10.5 134.075 6.5 117.875 6.5Z" 
          />
        <AnimatedPath 
          d="M175.365 72C175.365 85.8 183.765 59.2 185.365 54.8L198.465 18.5H198.765L175.365 93.5H174.365C174.365 78.5 174.265 33 173.865 21C173.665 15 172.865 6.5 157.865 6.5V6H175.365V72ZM127.865 96V95.5C132.865 95.5 137.565 92.6 142.665 78.5L166.765 11H167.365L144.365 78.6C139.465 92.8 143.865 95.5 148.865 95.5V96H127.865ZM190.565 6.5V6H207.865V73.5H207.365C207.365 58.5 206.765 33 206.365 21C206.165 15 206.365 6.5 190.565 6.5Z" 
          />
        <AnimatedPath 
          d="M222.225 6H252.225V88.4H251.825C251.625 82.5 250.925 77.3 250.225 75C248.425 69.2 243.225 67 222.225 67V66H251.425C251.425 55.4 250.825 26.2 250.025 18C248.925 12.7 245.225 7 232.225 6.8L222.225 6.6V6ZM197.225 96V95.5C202.225 95.5 206.925 92.6 212.025 78.5L237.025 8.3H237.625L213.725 78.6C208.825 92.8 213.225 95.5 218.225 95.5V96H197.225Z" 
          />
        <AnimatedPath 
          d="M302.586 6V21H301.986C301.986 16.9 301.686 16 300.486 13.5C298.486 9.3 294.286 7 285.886 6.8L278.186 6.6C276.586 10.3 273.586 19.8 273.286 20.5L302.486 50.9L302.586 86H301.786C301.786 66 300.486 48.8 272.286 20.5L277.586 6H302.586ZM247.586 96V95.5C252.586 95.5 257.286 92.5 262.386 78.5L277.786 36H278.386L264.086 78.6C259.286 92.9 263.586 95.5 276.086 95.5V96H247.586Z" 
          />
        <AnimatedPath 
          d="M327.586 40.5L355.086 6H362.586C350.786 15.7 332.586 34.9 328.786 40.5H362.586V96H362.086C362.086 86 361.986 66.8 360.986 54.8C360.486 48.8 359.686 41 344.686 41H327.586V40.5ZM292.586 96V95.5C297.586 95.5 302.286 92.7 307.386 78.5L328.786 18.3C330.786 12.8 331.686 6.5 328.086 6.5H327.586V6H333.686L309.086 78.6C304.286 92.8 308.586 95.5 313.586 95.5V96H292.586Z" 
          />
        <AnimatedPath 
          d="M189.6 107L180.3 134.5H219.8L228.8 109.3H229.4L220.8 134.5H239V148.8H238.7C238.4 145.1 238.1 141.7 236.9 139.5C235.5 137.1 234.8 136.2 220.4 135.7L205.5 179.6C200.6 193.8 205 196.5 210 196.5H230.8C246.9 196.5 247.4 195.2 252.4 181.4L256.7 169.5H257.2L248.3 197H189V196.5C194 196.5 198.7 193.6 203.8 179.5L219.4 135.7C211.2 135.4 198.9 135.3 180.1 135.2L165 179.6C160.2 193.8 164.5 196.5 169.5 196.5V197H148.5V196.5C153.5 196.5 158.2 193.7 163.3 179.5L178 138.3C185.7 116.4 184 113 180.6 110.4C177 107.5 172.4 107.5 147 107.5H126.6C119.3 107.5 114.5 108.7 114.5 132H114V107H189.6ZM111.5 197V196.5C116.5 196.5 121.2 193.6 126.3 179.5L151.3 109.3H151.9L128 179.6C123.1 193.8 127.5 196.5 132.5 196.5V197H111.5ZM214 107.3V107H256.5V132H256.2C256.2 129.2 256 118.7 252.4 114.4C249 110.2 245.6 108.2 234.4 107.9L214 107.3Z" 
          />
        <AnimatedPath 
          d="M95.0596 274C95.0596 287.8 103.46 261.2 105.06 256.8L118.16 220.5H118.46L95.0596 295.5H94.0596C94.0596 280.5 93.9596 235 93.5596 223C93.3596 217 92.5596 208.5 77.5596 208.5V208H95.0596V274ZM47.5596 298V297.5C52.5596 297.5 57.2596 294.6 62.3596 280.5L86.4596 213H87.0596L64.0596 280.6C59.1596 294.8 63.5596 297.5 68.5596 297.5V298H47.5596ZM110.26 208.5V208H127.56V275.5H127.06C127.06 260.5 126.46 235 126.06 223C125.86 217 126.06 208.5 110.26 208.5Z" 
          />
        <AnimatedPath 
          d="M145.069 208H175.069V290.4H174.669C174.469 284.5 173.769 279.3 173.069 277C171.269 271.2 166.069 269 145.069 269V268H174.269C174.269 257.4 173.669 228.2 172.869 220C171.769 214.7 168.069 209 155.069 208.8L145.069 208.6V208ZM120.069 298V297.5C125.069 297.5 129.769 294.6 134.869 280.5L159.869 210.3H160.469L136.569 280.6C131.669 294.8 136.069 297.5 141.069 297.5V298H120.069Z" 
          />
        <AnimatedPath 
          d="M227.53 208V238H227.03C227.03 233 227.13 229.6 226.53 223.2C225.23 211 225.03 208.9 206.03 208.3L181.53 280.6C176.73 294.8 181.03 297.5 195.03 297.5V298H165.03V297.5C170.03 297.5 174.83 294.6 179.83 280.5L205.53 208H227.53ZM192.53 280.1V279.8L227.53 256.6V290.4H227.13C227.13 277.9 226.93 266.5 224.03 264C220.13 260.7 205.03 273.1 192.53 280.1Z" 
          />
        <AnimatedPath 
          d="M258.701 220.3C260.701 214.8 263.201 209.3 255.001 208.6L253.701 208.5V208H275.501V208.5H275.001C264.901 208.5 262.601 211.1 261.101 215.6L239.001 280.6C234.201 294.8 237.501 297.5 245.001 297.5V298H217.501V297.5C226.901 297.5 232.201 294.7 237.301 280.5L258.701 220.3Z" 
          />
        <AnimatedPath 
          d="M317.96 208V238H317.46C317.46 233 317.56 229.6 316.96 223.2C315.66 211 315.46 208.9 296.46 208.3L271.96 280.6C267.16 294.8 271.46 297.5 285.46 297.5H286.66C302.06 297.5 302.56 296.2 307.56 282.4L311.86 270.5H312.36L303.46 298H255.46V297.5C260.46 297.5 265.26 294.6 270.26 280.5L295.96 208H317.96Z" 
          />
      </svg>
    </LogoAnimationContext.Provider>
  );
};

export default Logo;
