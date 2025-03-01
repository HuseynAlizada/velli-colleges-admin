import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './style.css';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';

export default function LoginSlider() {
    return (
        <>
            <Swiper
                pagination={true}
                modules={[Pagination, Autoplay]}
                autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                }}
                className="mySwiper">
                {
                    [1, 2, 3, 4, 5].map((_,index) => (
                        <SwiperSlide  key={index}>
                        <img src="/images/loginCover.png" className='rounded-2xl' alt="" />
        
                        </SwiperSlide>
                    ))
                }
             

            </Swiper>
        </>
    );
}
