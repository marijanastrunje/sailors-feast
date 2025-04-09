import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const HeroVideo = () => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadVideo = async () => {
      if (typeof window !== 'undefined') {
        const HlsModule = await import('hls.js');
        if (HlsModule.isSupported()) {
          const hls = new HlsModule.default();
          hls.loadSource('https://customer-609qhr7irtatscxi.cloudflarestream.com/428703937b6861109fcb800a8d3fcce5/manifest/video.m3u8');
          hls.attachMedia(videoRef.current);
          hls.on(HlsModule.Events.MANIFEST_PARSED, () => {
            if (isMounted) setIsReady(true);
          });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = 'https://customer-609qhr7irtatscxi.cloudflarestream.com/428703937b6861109fcb800a8d3fcce5/manifest/video.m3u8';
          setIsReady(true);
        }
      }
    };

    loadVideo();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="hero" className="align-items-md-center justify-content-md-start mb-0 position-relative">
      {!isReady && (
        <img
          src="/img/home/video-poster.jpg"
          alt="Sailor's Feast poster"
          className="position-absolute w-100 h-100 object-fit-cover"
          width={1440}
          height={600}
        />
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        width={1440}
        height={600}
        className="position-absolute w-100 h-100 object-fit-cover"
        poster="/img/home/video-poster.jpg"
        style={{ opacity: isReady ? 1 : 0, transition: "ease-in-out" }}
      />
      <div className="hero-text ps-md-5 ms-md-5">
        <img
          src="img/home/hand-drawn-boat-symbol-for-sailors-feast.png"
          alt="Hand-drawn boat symbol for Sailor's Feast"
          title="Hand-drawn boat symbol for Sailor's Feast"
          width={70}
          height={80}
          className="icon-dynamic me-2 mt-2"
        />
        <div>
          <h1 className="m-0">Sailor's Feast</h1>
          <h2 className="text-start mb-1">Yacht Supply Croatia</h2>
          <p>We provide fresh food and drinks delivered directly to your boat.</p>
          <Link to="/groceries" className="btn btn-prim" aria-label="Plan your meals and order food packages now">
            Shop now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroVideo;
