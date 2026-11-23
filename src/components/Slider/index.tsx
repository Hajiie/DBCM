import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import classes from './slider.module.scss';
import { transformImagePaths } from '../../utils/utils';

const Slider = ({ images, className }: { images: string[], className?: string }) => {
    return (
        <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop={images.length > 1}
            className={className}
        >
            {
                images.map((each, i) => (
                    <SwiperSlide className={classes.slide} key={i}>
                        <img src={transformImagePaths(each)} alt="" width="100%" className={'block cursor-grab'} />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    );
};

export default Slider;
