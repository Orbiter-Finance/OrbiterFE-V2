"use client"

import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Pagination, Autoplay } from 'swiper/modules'
export default function BannerList() {
    return (
        <Swiper
            className='w-full'
            centeredSlides={true}
            modules={[Autoplay, Pagination]}
            loop
            pagination={{
                clickable: true,
            }}
            autoplay={{
                delay: 4000,
                disableOnInteraction: false,
            }}
        >
            <SwiperSlide>
                <Image src="/assets/image/ecosystem/bob.png" width={722} height={194} className='w-full rounded-lg' alt="bob" />
            </SwiperSlide>
            <SwiperSlide>
                <Image src="/assets/image/ecosystem/bob.png" width={722} height={194} className='w-full rounded-lg' alt="bob" />
            </SwiperSlide>
            <SwiperSlide>
                <Image src="/assets/image/ecosystem/bob.png" width={722} height={194} className='w-full rounded-lg' alt="bob" />
            </SwiperSlide>
        </Swiper>
    )
}