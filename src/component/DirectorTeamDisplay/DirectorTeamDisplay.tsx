import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { directors } from "../../data/teamData";
import { useBoundingBox } from "@/hooks/useBoundingBox";
import { motion, useInView, useTransform } from "framer-motion";
import { useContainerScroll } from "../ScrollContainer/ScrollContainer";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import MainGrid from "../layouts/MainGrid";
import { breakpoints, useBreakpoint } from "@/hooks/useBreakpoints";
import Fixed from "../ScrollContainer/Fixed";
import { DirectorIllustration } from "./DirectorIllustration";
import { DirectorInfo } from "./DirectorInfo";

type Props = {};

const DirectorTeamDisplay = (props: Props) => {
  const [containerRef, bound] = useBoundingBox<HTMLDivElement>([]);
  const windowDim = useWindowDimension();
  const isDesktop = useBreakpoint(breakpoints.md);

  const [currentDirector, setCurrentDirector] = useState(0);
  const { scrollY } = useContainerScroll();

  useEffect(() => {
    const handleMotionChange = (pos: number) => {
      // decide which one is the current one
      const totalDirectors = directors.length;

      const offsetVH = isDesktop ? 0.3 : 0.2;
      const offset = pos - bound.top + windowDim.height * offsetVH;
      const currentProgress = offset / bound.height;
      const currentDirector = Math.round(currentProgress * totalDirectors);
      setCurrentDirector(currentDirector);
      // console.log(offset);
    };

    handleMotionChange(scrollY.get());

    const cleanupScroll = scrollY.on("change", handleMotionChange);

    return () => {
      cleanupScroll();
    };
  }, [bound, scrollY, windowDim, isDesktop]);

  const itemScrollHeightVW = isDesktop ? 15 : 40;

  return (
    <MainGrid
      ref={containerRef}
      className="relative"
      style={{
        marginBottom: `${itemScrollHeightVW}vw`,
      }}
    >
      <div className="md:col-span-1 md:col-start-1 lg:col-span-1 lg:col-start-2 2xl:col-span-1 2xl:col-start-2">
        <div className="mt-[15vw]">
          {directors.map((director, i) => {
            return (
              <React.Fragment key={i}>
                {!isDesktop && (
                  <Fixed
                    bottom="0px"
                    left="0"
                    top={"auto"}
                    right="0px"
                    key={i}
                    pointerEvents="none"
                  >
                    <DirectorInfo
                      director={director}
                      currentDirector={currentDirector}
                      index={i}
                      itemScrollHeightVW={itemScrollHeightVW}
                    />
                  </Fixed>
                )}
                {isDesktop && (
                  <DirectorInfo
                    director={director}
                    currentDirector={currentDirector}
                    index={i}
                    itemScrollHeightVW={itemScrollHeightVW}
                    key={i}
                  />
                )}
              </React.Fragment>
            );
          })}{" "}
        </div>
      </div>
      <div className="col-span-full col-start-1 flex flex-col md:col-span-3 md:col-start-3 2xl:col-span-4 2xl:col-start-4">
        {directors.map((director, i) => {
          const isOdd = i % 2 === 0;
          const isCurrentDirector = currentDirector === i;

          const imageWidth = `${itemScrollHeightVW * 2.1}vw`;
          return (
            <DirectorIllustration
              key={i}
              isOdd={isOdd}
              isCurrentDirector={isCurrentDirector}
              director={director}
              imageWidth={imageWidth}
              itemScrollHeightVW={itemScrollHeightVW}
              onDirectorEnter={() => setCurrentDirector(i)}
            />
          );
        })}
      </div>
    </MainGrid>
  );
};

export default DirectorTeamDisplay;
