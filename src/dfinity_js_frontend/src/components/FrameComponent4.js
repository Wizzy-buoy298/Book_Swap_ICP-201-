import React, { useState, useEffect } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Img } from "../components/Img";
import * as Images from "../assets/images";
import {
  getTotalBooks,
  getTotalCompletedSwapRequests,
  getTotalUsers,
} from "../utils/BookSwap";

const FrameComponent4 = ({ className = "" }) => {
  const [books, setBooks] = useState([]);
  const [completedSwapRequests, setCompletedSwapRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const onConnectWalletClick = useCallback(() => {
    navigate("/profile?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai");
  }, [navigate]);

  const onStartSwappingClick = useCallback(() => {
    navigate("/profile?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai");
  }, [navigate]);

  const onListBookContainerClick = useCallback(() => {
    navigate("/profile?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai");
  }, [navigate]);

  // Helper function to format numbers with commas
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  useEffect(() => {
    getTotalBooks().then((response) => {
      if (response.Ok !== undefined) {
        setBooks(response.Ok);
      } else {
        console.error("Error fetching total books:", response.Err);
      }
    });

    getTotalCompletedSwapRequests().then((response) => {
      if (response.Ok !== undefined) {
        setCompletedSwapRequests(response.Ok);
      } else {
        console.error("Error fetching completed swap requests:", response.Err);
      }
    });

    getTotalUsers().then((response) => {
      if (response.Ok !== undefined) {
        setUsers(response.Ok);
      } else {
        console.error("Error fetching total users:", response.Err);
      }
    });

  }, []);

  return (
    <section
      className={`self-stretch flex flex-row items-start justify-center pt-0 pb-[55px] pr-5 pl-[23px] box-border max-w-full text-left text-39xl text-gray-200 font-epilogue mq725:pb-9 mq725:box-border ${className}`}
    >
      <div className="w-[1205px] flex flex-col items-end justify-start gap-[108px] max-w-full mq450:gap-[27px] mq725:gap-[54px]">
        <header className="self-stretch flex flex-row items-start justify-end py-0 pr-0.5 pl-[3px] box-border max-w-full text-left text-7xl text-gray-200 font-epilogue">
          <div className="flex-1 flex flex-row items-start justify-between max-w-full gap-[20px]">
            <div className="flex flex-col items-start justify-start pt-1 px-0 pb-0">
              <h2 className="m-0 relative text-inherit leading-[40px] font-bold font-inherit whitespace-nowrap">
                BookChainSwap
              </h2>
            </div>
            <button
              className="cursor-pointer [border:none] py-[11px] px-3 bg-cadetblue-100 rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap hover:bg-cadetblue-200"
              onClick={onConnectWalletClick}
            >
              <a className="[text-decoration:none] relative text-mid leading-[26px] font-inter text-white text-left inline-block min-w-[121px]">
                Connect wallet
              </a>
            </button>
          </div>
        </header>
        <div className="self-stretch flex flex-row items-start justify-start gap-[79px] max-w-full mq450:gap-[20px] mq1050:flex-wrap mq725:gap-[39px]">
          <div className="flex-1 flex flex-col items-start justify-start gap-[101px] min-w-[489px] max-w-full mq450:gap-[25px] mq725:min-w-full mq1000:gap-[50px]">
            <div className="self-stretch flex flex-col items-start justify-start gap-[20px] max-w-full">
              <h1 className="m-0 self-stretch relative text-inherit leading-[76px] font-bold font-inherit mq450:text-16xl mq450:leading-[46px] mq1000:text-27xl mq1000:leading-[61px]">
                Decentralized book swapping experience
              </h1>
              <h3 className="m-0 w-[644px] relative text-xl leading-[30px] font-bold font-inherit inline-block max-w-full mq450:text-base mq450:leading-[24px]">
                Transparent book marketplace with decentralized profiles and
                book listings
              </h3>
              <div className="flex flex-row items-center justify-start gap-[12px] max-w-full text-lg font-inter mq450:flex-wrap">
                <button
                  className="cursor-pointer [border:none] py-[15px] px-[47px] bg-cadetblue-100 rounded overflow-hidden flex flex-row items-center justify-center whitespace-nowrap hover:bg-cadetblue-200"
                  onClick={onStartSwappingClick}
                >
                  <div className="relative text-base leading-[26px] font-inter text-white text-left inline-block min-w-[115px]">
                    Start swapping
                  </div>
                </button>
                <div
                  className="rounded bg-white overflow-hidden flex flex-row items-center justify-center py-[13px] px-[52px] whitespace-nowrap cursor-pointer border-[1px] border-solid border-gray-200"
                  onClick={onListBookContainerClick}
                >
                  <div className="relative leading-[28px] inline-block min-w-[78px]">
                    List book
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[465px] flex flex-row items-start justify-between gap-[20px] max-w-full text-16xl mq450:flex-wrap">
              <div className="flex flex-col items-start justify-start">
                <b className="relative leading-[50px] inline-block min-w-[93px] mq450:text-2xl mq450:leading-[30px] mq1000:text-9xl mq1000:leading-[40px]">
                  {formatNumber(books)}
                </b>
                <a className="[text-decoration:none] relative text-lg leading-[28px] font-bold text-[inherit] inline-block min-w-[57px]">
                  Listed
                </a>
              </div>
              <div className="flex flex-col items-start justify-start">
                <b className="relative leading-[50px] inline-block min-w-[90px] mq450:text-2xl mq450:leading-[30px] mq1000:text-9xl mq1000:leading-[40px]">
                  {formatNumber(completedSwapRequests)}
                </b>
                <b className="relative text-lg leading-[28px] inline-block min-w-[85px]">
                  Swapped
                </b>
              </div>
              <div className="flex flex-col items-start justify-start">
                <b className="relative leading-[50px] mq450:text-2xl mq450:leading-[30px] mq1000:text-9xl mq1000:leading-[40px]">
                  {formatNumber(users)}
                </b>
                <b className="relative text-lg leading-[28px] inline-block min-w-[115px]">
                  Active users
                </b>
              </div>
            </div>
          </div>
          <div className="shadow-[0px_0px_2px_rgba(23,_26,_31,_0.12),_0px_0px_1px_rgba(23,_26,_31,_0.07)] rounded-4xs bg-whitesmoke flex flex-col items-start justify-start p-1 box-border gap-[25px] min-w-[374px] max-w-full text-mini font-inter mq450:min-w-full mq1050:flex-1">
            <img
              className="w-[358px] relative rounded max-h-full object-cover max-w-full"
              loading="lazy"
              alt=""
              src="/image-18@2x.png"
            />
            <Img
              src={Images.imgImage_18}
              className="w-[358px] relative rounded max-h-full object-cover max-w-full"
              loading="lazy"
              alt=""
            />

            <div className="shadow-[0px_0px_2px_rgba(23,_26,_31,_0.12),_0px_0px_1px_rgba(23,_26,_31,_0.07)] rounded bg-white flex flex-row items-start justify-start pt-[21px] px-5 pb-5 gap-[10px] mq450:flex-wrap">
              <div className="flex flex-col items-start justify-start gap-[11px]">
                <div className="flex flex-row items-start justify-start py-0 px-[3px]">
                  <div className="flex flex-col items-start justify-start gap-[1px]">
                    <div className="relative leading-[24px] inline-block min-w-[80px]">
                      Book name
                    </div>
                    <div className="relative leading-[24px] inline-block min-w-[19px]">
                      4.1
                    </div>
                  </div>
                </div>
                <button className="cursor-pointer py-2.5 pr-[59px] pl-[60px] bg-white rounded overflow-hidden flex flex-row items-start justify-start border-[1px] border-solid border-gray-200 hover:bg-gainsboro hover:box-border hover:border-[1px] hover:border-solid hover:border-darkslategray">
                  <div className="relative text-sm leading-[22px] font-inter text-gray-200 text-left inline-block min-w-[37px]">
                    Swap
                  </div>
                </button>
              </div>
              <div className="flex flex-col items-start justify-start gap-[11px]">
                <div className="flex flex-row items-start justify-start py-0 px-px">
                  <div className="flex flex-col items-start justify-start gap-[1px]">
                    <div className="relative leading-[24px] inline-block min-w-[91px]">
                      Listed books
                    </div>
                    <div className="relative leading-[24px] inline-block min-w-[111px]">
                      1d 11h 36m 42s
                    </div>
                  </div>
                </div>
                <button className="cursor-pointer py-2 px-[29px] bg-white rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap border-[1px] border-solid border-gray-200 hover:bg-gainsboro hover:box-border hover:border-[1px] hover:border-solid hover:border-darkslategray">
                  <div className="relative text-mid leading-[26px] font-inter text-gray-200 text-left inline-block min-w-[98px]">
                    View details
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

FrameComponent4.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent4;
