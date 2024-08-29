import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Img } from "../components/Img";
import * as Images from "../assets/images";
import { getFeaturedSwappers } from "../utils/BookSwap";

const FrameComponent3 = ({ className = "" }) => {
  const [swappers, setSwappers] = useState([]);

  useEffect(() => {
    const fetchSwappers = async () => {
      const response = await getFeaturedSwappers();
      if (response.Ok) {
        setSwappers(response.Ok);
      } else {
        console.error("Failed to fetch swappers:", response.Err);
      }
    };
    fetchSwappers();
  }, []);

  return (
    <div
      className={`w-[1206px] flex flex-col items-start justify-start gap-[86px] max-w-full text-left text-5xl text-gray-200 font-epilogue mq450:gap-[21px] mq725:gap-[43px] ${className}`}
    >
      <div className="self-stretch flex flex-col items-start justify-start gap-[19px] max-w-full">
        <div className="flex flex-row items-start justify-start py-0 px-1 box-border max-w-full">
          <h2 className="m-0 relative text-inherit leading-[36px] font-bold font-inherit mq450:text-lgi mq450:leading-[29px]">
            Featured swappers this month
          </h2>
        </div>
        <div className="self-stretch grid flex-row items-end justify-start gap-[19px] grid-cols-[repeat(4,_minmax(216px,_1fr))] text-lg mq450:grid-cols-[minmax(216px,_1fr)] mq1000:justify-center mq1000:grid-cols-[repeat(2,_minmax(216px,_374px))]">
          {swappers.map((swapper, index) => (
            <div
              key={swapper.userId}
              className="flex flex-col items-start justify-start py-0 pr-1 pl-0"
            >
              <div className="self-stretch shadow-[0px_0px_2px_rgba(23,_26,_31,_0.12),_0px_0px_1px_rgba(23,_26,_31,_0.07)] rounded-41xl bg-white flex flex-col items-start justify-start">
                <Img
                  src={Images.imgImage_12} // Replace with dynamic image based on swapper if available
                  className="self-stretch h-[116px] relative rounded max-w-full overflow-hidden shrink-0 object-cover"
                  loading="lazy"
                  alt=""
                />
                <div className="self-stretch shadow-[0px_0px_2px_rgba(23,_26,_31,_0.12),_0px_0px_1px_rgba(23,_26,_31,_0.07)] rounded bg-whitesmoke flex flex-col items-start justify-start pt-3 px-2.5 pb-[13px] gap-[10px]">
                  <div className="flex flex-row items-start justify-start gap-[14px]">
                    <Img
                      src={Images.imgImage_14} // Replace with dynamic profile image if available
                      className="h-11 w-11 relative rounded-3xl object-contain"
                      loading="lazy"
                      alt=""
                    />
                    <div className="flex flex-col items-start justify-start">
                      <b className="relative leading-[28px]">
                        {swapper.username}
                      </b>
                      <div className="relative text-xs leading-[20px] font-inter inline-block min-w-[92px]">
                        @{swapper.username.replace(/\s+/g, "")} {/* Generating a simple handle */}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch flex flex-row items-start justify-start py-0 pr-0.5 pl-1 text-2xs font-inter">
                    <div className="flex-1 flex flex-col items-end justify-start gap-[4px]">
                      <div className="self-stretch flex flex-row items-start justify-start gap-[26px]">
                        <div className="flex flex-col items-start justify-start">
                          <div className="relative leading-[18px] inline-block min-w-[66px]">
                            Books Swapped
                          </div>
                          <div className="relative text-smi leading-[22px] inline-block min-w-[60px] whitespace-nowrap">
                            {swapper.booksSwapped.toString()} {/* Converting BigInt to string */}
                          </div>
                        </div>
                        <div className="flex flex-col items-start justify-start py-0 pr-[11px] pl-0">
                          <div className="relative leading-[18px] inline-block min-w-[50px]">
                            Followers
                          </div>
                          <div className="relative text-mini leading-[24px] inline-block min-w-[40px]">
                            0 {/* Replace with dynamic follower count if available */}
                          </div>
                        </div>
                        <button className="cursor-pointer py-[5px] px-[15px] bg-whitesmoke flex-1 rounded-8xl overflow-hidden flex flex-row items-start justify-start border-[1px] border-solid border-gray-200 hover:bg-lightgray-100 hover:box-border hover:border-[1px] hover:border-solid hover:border-darkslategray">
                          <div className="relative text-sm leading-[22px] font-inter text-gray-200 text-left inline-block min-w-[43px]">
                            Follow
                          </div>
                        </button>
                      </div>
                      <div className="self-stretch flex flex-row items-start justify-end py-0 pr-px pl-0">
                        <div className="flex-1 flex flex-row items-start justify-start gap-[11px]">
                          <Img
                            src={Images.imgImage_6} // Replace with dynamic book images if available
                            className="h-[79px] w-[79px] relative rounded object-cover min-h-[79px]"
                            loading="lazy"
                            alt=""
                          />
                          <Img
                            src={Images.imgImage_1} // Replace with dynamic book images if available
                            className="h-[79px] w-[79px] relative rounded object-cover min-h-[79px]"
                            loading="lazy"
                            alt=""
                          />
                          <Img
                            src={Images.imgImage_9} // Replace with dynamic book images if available
                            className="h-[79px] w-[79px] relative rounded object-cover min-h-[79px]"
                            loading="lazy"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

FrameComponent3.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent3;
