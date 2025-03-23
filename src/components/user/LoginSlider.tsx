// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './style.css';

// import required modules
import { Autoplay, Pagination } from 'swiper/modules';
const images = ['/images/login-image1.avif', '/images/login-image2.avif', '/images/login-image3.avif', '/images/login-slider4.avif']

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
                    images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image} className='rounded-2xl' alt="" />

                        </SwiperSlide>
                    ))
                }


            </Swiper>
        </>
    );
}
