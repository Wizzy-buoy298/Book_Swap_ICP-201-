import React from "react";
import { Link } from "react-router-dom";

import FrameComponent4 from "../../components/FrameComponent4";
import FrameComponent3 from "../../components/FrameComponent3";

function HomeLanding() {
  return (
    <div className="w-full relative shadow-[0px_3px_6px_rgba(18,_15,_40,_0.12)] bg-white overflow-hidden flex flex-col items-end justify-start pt-[46px] pb-0.5 pr-0.5 pl-0 box-border gap-[142px] leading-[normal] tracking-[normal] mq450:gap-[35px] mq725:gap-[71px]">
      <FrameComponent4 />
      <section className="self-stretch flex flex-row items-start justify-center py-0 pr-5 pl-[22px] box-border max-w-full">
        <FrameComponent3 />
      </section>
      <section className="self-stretch shadow-[0px_0px_2px_rgba(23,_26,_31,_0.12),_0px_0px_1px_rgba(23,_26,_31,_0.07)] rounded bg-white flex flex-row items-start justify-between pt-[30px] pb-[27px] pr-28 pl-[120px] box-border max-w-full gap-[20px] text-left text-mini text-gray-200 font-inter mq450:pl-5 mq450:pr-5 mq450:box-border mq725:pl-[60px] mq725:pr-14 mq725:box-border mq1000:flex-wrap mq1000:justify-center">
        <div className="w-[391px] flex flex-row items-start justify-center gap-[51px] max-w-full mq450:flex-wrap mq450:gap-[25px]">
          <a className="[text-decoration:none] relative leading-[24px] text-[inherit] inline-block min-w-[81px]">
            Decentraliz
          </a>
          <div className="flex-1 flex flex-col items-start justify-start pt-0.5 px-0 pb-0 box-border min-w-[168px]">
            <div className="self-stretch flex flex-row items-start justify-start gap-[25px]">
              <div className="relative leading-[24px] inline-block min-w-[86px]">
                BookChainS
              </div>
              <div className="flex flex-col items-start justify-start pt-px pb-0 pr-[11px] pl-0">
                <div className="relative leading-[24px] inline-block min-w-[55px]">
                  Literary
                </div>
              </div>
              <div className="relative leading-[24px] inline-block min-w-[57px]">
                Join the
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start pt-0.5 px-0 pb-0">
          <div className="relative leading-[24px]">@ BookChainSwap</div>
        </div>
      </section>
    </div>
  );
}

export default HomeLanding;
