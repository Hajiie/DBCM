/**These are necessary imports / components for the page */
import { ImageSize, TextAlign, ListType } from "../src/shared/enums";
import { PageLayout, Text, List, Image, LinkTo, Seperator, Slider } from "../src/components";
import { CURRENT_YEAR } from "../src/constants/appConstants";
import { iSEO } from "../src/shared/interfaces";

const Members = () => {
    const PAGE_SEO: iSEO = {
        title: 'Members',
        description: `홍익대학교 DBCM Lab`,
        keywords: 'DBCM, Members, Hongik University, DBCM Lab',
        author: 'SUNGHEE'
    }
    return (
        <PageLayout PAGE_SEO={PAGE_SEO} home>
            <section className='container px-3 md:pb-20 md:pt-10 pt-20'>
                <div className="">
                    <Text title className='mb-3 mt-5 dark:text-sky-900 text-sky-900'>
                        Professor
                    </Text>
                    {/* Flexbox를 사용하여 이미지와 텍스트를 가로로 정렬 */}
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/professor.png" alt="professor" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                안승준 <br />
                                Seungjun (Jun) Ahn, PhD
                                <br />
                                <br />
                            </Text>
                            <Text subtitle className='ml-4 dark:text-gray-600 text-gray-500'>
                                부교수 | 공학박사
                                <Text p className='text-m font-medium'>
                                    Associate Professor
                                    <br/>
                                    <br/>
                                </Text>
                            </Text>
                            <Text subtitle className='ml-4 dark:text-sky-900 text-sky-900'>
                                홍익대학교 건설환경공학과
                                <Text p className='text-m font-medium'>
                                    Department of Civil and Environmental Engineering, Hongik University
                                </Text>
                            </Text>
                        </div>
                    </div>
                    <Text p className='dark:text-gray-600 text-gray-500'>
                        04066 서울특별시 마포구 와우산로 94, 제2공학관(P동) 817호<br />
                        P817, 94 Wausanro, Mapo-gu, Seoul, 04066, Republic of Korea
                    </Text>
                    <Text p className='dark:text-gray-600 text-gray-500'>
                        연구실 전화: <a href="tel:02-320-1621">02-320-1621</a><br />
                        이메일: <a href="mailto:jun.ahn@hongik.ac.kr">jun.ahn@hongik.ac.kr</a>
                    </Text>
                    <Text p className='dark:text-gray-600 text-gray-500'>
                        Phone: <a href="tel:+82-2-320-1621">+82-2-320-1621</a><br/>
                        Email: <a href="mailto:jun.ahn@hongik.ac.kr">jun.ahn@hongik.ac.kr</a>
                        <br/>
                        <br/>
                    </Text>
                    <Text subtitle className='ml-1 dark:text-sky-900 text-sky-600'>
                        경력
                    </Text>
                    <Text className="font-semibold dark:text-black">
                        <div className="flex">
                            <span className="w-64">2025/02/27 ~ 현재</span>
                            <span>홍익대학교 건설환경공학과 부교수</span>
                        </div>
                    </Text>
                    <Text p className='dark:text-gray-600 text-gray-500'>
                        <div className="flex">
                            <span className="w-64">2021/09/01 ~ 2025/02/27</span>
                            <span>홍익대학교 건설환경공학과 조교수</span>
                        </div>
                        <div className="flex">
                            <span className="w-64">2021/01/01 ~ 2021/08/31</span>
                            <span>University of South Australia Senior Lecturer</span>
                        </div>
                        <div className="flex">
                            <span className="w-64">2016/07/11 ~ 2020/12/31</span>
                            <span>University of South Australia Lecturer</span>
                        </div>
                        <div className="flex">
                            <span className="w-64">2014/10/15 ~ 2016/04/30</span>
                            <span>University of Alberta Postdoc</span>
                        </div>
                        <div className="flex">
                            <span className="w-64">2010/03/23 ~ 2010/06/17</span>
                            <span>건설산업연구원 연구원</span>
                        </div>
                    </Text><hr/>
                </div>
                <div className="">
                    <Text title className='mb-3 mt-5 dark:text-sky-900 text-sky-900'>
                        Researchers
                    </Text>
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/Felix.png" alt="felix" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                Felix (Kong Fansheng) <br />
                                <Text p className='font-medium'>(23년 2월 ~ )</Text>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                홍익대학교 건설환경공학과 (박사 과정) <br />
                                Department of Civil and Environmental Engineering, Hongik University (Postgraduate Student) <br />
                                Email: <a href="mailto:konfy004@gmail.com">konfy004@gmail.com</a><br/>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                ▪︎ 대심도 철도시설물 안전 대피 성능 시뮬레이션 모델 구축
                            </Text>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/Jungwon.png" alt="Jungwon" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                이중원 (Jungwon Lee)<br />
                                <Text p className='font-medium'>(22년 7월 ~ )</Text>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                홍익대학교 건설환경공학과 (석사 과정) <br />
                                Department of Civil and Environmental Engineering, Hongik University (Masters Student) <br />
                                Email: <a href="mailto:ok122800@gmail.com">ok122800@gmail.com</a><br/>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                ▪︎ 건설현장 안전관리 자동화를 위한 인지적 에이전트 시스템 개발<br/>
                                ▪︎ 건설기준 디지털 전환을 위한 건설기준 라이브러리 및 온톨로지 구축활용 기술개발 연구<br/>
                                ▪︎ 고속도로 지반시설물 정보체계표준화 및 BIM 모델링 가이드 수립 용역<br/>
                                ▪︎ 수상: 한국건설관리학회 2023년 정기학술발표대회 우수논문상<br/>
                            </Text>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/Jiwon.png" alt="Jiwon" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                정지원 (Jiwon Jeong)<br />
                                <Text p className='font-medium'>(22년 1월 ~ )</Text>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                홍익대학교 건설환경공학과 (석사 과정) <br />
                                Department of Civil and Environmental Engineering, Hongik University (Masters Student) <br />
                                Email: <a href="mailto:xxx03018@naver.com">xxx03018@naver.com</a><br/>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                ▪︎ 고속도로 노선 공용 전 교통위험도 추정을 위한 AI 기술 개발 및 검증<br/>
                                ▪︎ 대심도 철도시설물 안전 대피 성능 시뮬레이션 모델 구축<br/>
                                ▪︎ 건설현장 고소작업 인간-로봇 협업 기술 및 통합운영 시스템 개발<br/>
                                ▪︎ 수상: 한국건설관리학회 2022년 전국대학생 학술발표대회 논문부문 우수상<br/>
                                ▪︎ 수상: 한국건설관리학회 2023년 전국대학생 학술발표대회 논문부문 장려상<br/>
                                ▪︎ 수상: 토목학회 2023년 우수논문상<br/>
                            </Text>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/Yuri.png" alt="Yuri" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                김유리 (Yuri Kim)<br />
                                <Text p className='font-medium'>(25년 1월 ~ )</Text>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                홍익대학교 건설환경공학과 (석사 과정) <br />
                                Department of Civil and Environmental Engineering, Hongik University (Masters Student) <br />
                                Email: <a href="mailto:lfamousl@naver.com">lfamousl@naver.com</a><br/>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                ▪︎ 고속도로 지반시설물 정보체계표준화 및 BIM 모델링 가이드 수립 용역<br/>
                            </Text>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/Sunghee.png" alt="Sunghee" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                이성희 (Sunghee Lee)<br />
                                <Text p className='font-medium'>(23년 7월 ~ )</Text>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                홍익대학교 건설환경공학과 (학부 과정) <br />
                                Department of Civil and Environmental Engineering, Hongik University (Undergraduate Student) <br />
                                Email: <a href="mailto:dhqks507@gmail.com">dhqks507@gmail.com</a><br/>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                ▪︎ 건설기준 디지털 전환을 위한 건설기준 라이브러리 및 온톨로지 구축활용 기술개발 연구<br/>
                            </Text>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/Seungho.png" alt="Seungho" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                최승호 (Seungho Choi)<br />
                                <Text p className='font-medium'>(24년 6월 ~ )</Text>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                홍익대학교 건설환경공학과 (학사 과정) <br />
                                Department of Civil and Environmental Engineering, Hongik University (Undergraduate Student) <br />
                                Email: <a href="mailto:thomas.seungho@gmail.com">thomas.seungho@gmail.com</a><br/>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                ▪︎ 건설현장 고소작업 인간-로봇 협업 기술 및 통합운영 시스템 개발<br/>
                                ▪︎ 수상: 한국건설관리학회 2024년 전국대학생 학술발표대회 논문부문 장려상<br/>
                            </Text>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/Donghyun.png" alt="Donghyun" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                강동현 (Donghyun Kang)<br />
                                <Text p className='font-medium'>(25년 1월 ~ )</Text>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                홍익대학교 건설환경공학과 (학사 과정) <br />
                                Department of Civil and Environmental Engineering, Hongik University (Undergraduate Student) <br />
                                Email: <a href="mailto:kdong1228@gmail.com">kdong1228@gmail.com</a><br/>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                ▪︎ 고속도로 노선 공용 전 교통위험도 추정을 위한 AI 기술 개발 및 검증<br/>
                            </Text>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/Junhyun.png" alt="Junhyun" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                이준현 (Junhyun Lee)<br />
                                <Text p className='font-medium'>(25년 1월 ~ )</Text>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                홍익대학교 건설환경공학과 (학사 과정) <br />
                                Department of Civil and Environmental Engineering, Hongik University (Undergraduate Student) <br />
                                Email: <a href="mailto:leejunhyun6513@gmail.com">leejunhyun6513@gmail.com</a><br/>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                ▪︎ 건설현장 안전관리 자동화를 위한 인지적 에이전트 시스템 개발<br/>
                                ▪︎ 고속도로 지반시설물 정보체계표준화 및 BIM 모델링 가이드 수립 용역<br/>
                            </Text>
                        </div>
                    </div>
                </div><hr/>
                <div className="">
                    <Text title className='mb-3 mt-5 dark:text-sky-900 text-sky-900'>
                        Alumni
                    </Text>
                    <div className="flex items-start">
                        <div className="mr-20 block md:w-[15%] w-[50%]">
                            <Image src="/images/members_img/Woohyuk.png" alt="Woohyuk" className="rounded-lg overflow-hidden" />
                        </div>
                        <div className="">
                            <Text subtitle className='ml-4 dark:text-black'>
                                김우혁 (Woohyuk Kim)<br />
                                <Text p className='font-medium'>(22년 1월 ~ 22년 12월)</Text>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                홍익대학교 건설환경공학과 (학사) <br />
                                Bachelor of Civil and Environmental Engineering, Hongik University <br />
                                Email: <a href="mailto:zlddngur@naver.com">zlddngur@naver.com</a><br/>
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                現 도화엔지니어링
                            </Text>
                            <Text p className='ml-4 dark:text-black'>
                                ▪︎ 수상: 한국건설관리학회 2022년 전국대학생 학술발표대회 논문부문 장려상<br/>
                            </Text>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    )
}

export default Members;