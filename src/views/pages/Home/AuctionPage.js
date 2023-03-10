import React, { useState, useEffect, useRef } from "react";
import { Container, Box, Typography, makeStyles } from "@material-ui/core";
import UserDetailsCard from "src/component/UserCard";
import BundleCard from "src/component/NewBundleCard";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { useNavigate } from "react-router";
import { isMobile, isTablet } from "react-device-detect";
import "./style.css";

const useStyles = makeStyles(() => ({
  mas: {
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "32px",
    fontWeight: "700",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.51",
    letterSpacing: "normal",
    texAlign: "left",
    color: "#141518",
    marginTop: "0px",
  },
  LoginBox: {},
  sectionHeading: {
    backgroundColor: "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
    display: "flex",
    justifyContent: "center",
  },
  search: {
    border: "0px solid #e5e3dd",
    display: "flex",
    alignItems: "center",
    borderRadius: "0px",
  },
  box: {
    flexWrap: "inherit",
  },
  gridbox: {
    "@media(max-width:1280px)": {
      display: "flex",
      justifyContent: "center",
    },
  },
}));

const AuctionPage = () => {
  // console.log(NFTData)
  const classes = useStyles();
  const navigate = useNavigate();
  const [auctionList, setAuctionList] = useState([]);
  const [allNFTList, setAllNFTList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userListToDisplay, setUserListToDisplay] = useState([]);
  const [isLoadingCreators, setIsLoadingCreators] = useState(false);
  const [isLoadingBundles, setIsBundlesLoading] = useState(false);
  const [isLoadingAuctions, setIsLaodingAuctions] = useState(false);
  const settings = {
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    centerMode: false,
    autoplay: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0",
          autoplay: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          centerMode: false,
          centerPadding: "0",
          autoplay: false,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0",
          autoplay: false,
        },
      },
    ],
  };

  const auctionNftListHandler = async () => {
    setIsLaodingAuctions(true);
    await axios({
      method: "GET",
      url: Apiconfigs.allorder,
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          if (res.data.result) {
            setAuctionList(res.data.result);
            setIsLaodingAuctions(false);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
        setIsLaodingAuctions(false);
      });
  };

  const listAllNftHandler = async () => {
    setIsBundlesLoading(true);
    await axios({
      method: "GET",
      url: Apiconfigs.listAllNft,
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setAllNFTList(res.data.result);
        }
        setIsLoading(false);
        setIsBundlesLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsBundlesLoading(false);
        console.log(err.message);
      });
  };

  const getuser = async () => {
    setIsLoading(true);
    setIsLoadingCreators(true);
    axios({
      method: "GET",
      url: Apiconfigs.latestUserList,
      params: {
        limit: 10,
        userType: "Creator",
      },
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          if (res.data.result.docs) {
            setUserListToDisplay(res.data.result.docs);
            setIsLoading(false);
            setIsLoadingCreators(false);
          }
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsLoadingCreators(false);
      });
  };

  useEffect(() => {
    auctionNftListHandler();
    listAllNftHandler();
    getuser();
    let resize = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
    return () => clearTimeout(resize);
  }, []);

  // Start My Code "Here I have started writing the code"
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // End My Code

  return (
    <>
      {/* Creators */}
      <Container maxWidth='100%' style={{
        marginBottom: '-20px',
        backgroundClor: '#D9AFD9',
        backgroundImage: 'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)'
      }}>
        <div id="creators_section" className={classes.sectionHeading}>
          <Typography variant="h2" component='h2'
            onClick={() => navigate("/creators")}
            style={{ cursor: "pointer", margin: '20px auto', fontSize: '66px', color: "#444" }}
          >
            Creators
          </Typography>
        </div>
        <Carousel infiniteLoop={false} centerMode={true} centerSlidePercentage={30000 / windowSize.innerWidth} numItemsPerView={5}>
          {userListToDisplay.map((data, i) => {
            return (
              <UserDetailsCard key={i}
                data={data}
              />
            );
          })}
        </Carousel>
      </Container>
      {/* Bundles */}
      <Container
        maxWidth="100%"
        style={{
          marginBottom: '-20px',
          backgroundClor: "#D9AFD9",
          backgroundImage: "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
        }}
      >
        <div id="bundle_section" className={classes.sectionHeading}>
          <Typography
            variant="h2"
            component="h2"
            onClick={() => navigate("/bundles")}
            style={{
              cursor: "pointer",
              margin: "20px auto",
              fontSize: "66px",
              color: "#444",
            }}
          >
            Bundles
          </Typography>
        </div>
        <Carousel
          infiniteLoop={false}
          centerMode={true}
          centerSlidePercentage={35000 / windowSize.innerWidth}
          numItemsPerView={5}
        >
          {allNFTList &&
            allNFTList.map((data, i) => {
              return <BundleCard data={data} key={i} />;
            })}
        </Carousel>
      </Container>
      {/* NFT Auction */}
      <Container
        maxWidth="100%"
        style={{
          backgroundClor: "#D9AFD9",
          backgroundImage: "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
        }}
      >
        <div id="auctions_section" className={classes.sectionHeading}>
          <Typography
            variant="h2"
            component="h2"
            onClick={() => navigate("/auctions")}
            style={{
              cursor: "pointer",
              margin: "20px auto",
              fontSize: "66px",
              color: "#444",
            }}
          >
            NFT Auction
          </Typography>
        </div>
        {!isLoadingAuctions && auctionList.length === 0 ? (
          <Box
            align="center"
            style={{
              margin: "0px",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              minHeight: "300px",
              mixBlendMode: "darken",
              backgroundImage: "url(/images/home/nft-comingsoon-bg.png)",
              backgroundSize: "cover",
              backgroundPosition: "50% 50%",
            }}
            mt={4}
            mb={5}
          >
            <Typography
              variant="h1"
              style={{
                color: "#fffa",
                textAlign: "center",
                fontSize: "10vw",
                textShadow: "rgb(81 13 29) 1px 1px 4px",
              }}
            >
              COMING SOON
            </Typography>
          </Box>
        ) : (
          ""
        )}
      </Container>
    </>
  );
};

export default AuctionPage;
