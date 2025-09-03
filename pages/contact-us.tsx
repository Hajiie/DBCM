/**These are necessary imports / components for the page */
import { ImageSize, TextAlign, ListType } from "../src/shared/enums";
import { PageLayout, Text, List, Image, LinkTo, Seperator, Slider  } from "../src/components";
import { iSEO } from "../src/shared/interfaces";

const ContactUs = () => {
    const PAGE_SEO: iSEO = {
        title: 'Contact Us',
        description: '문의사항이 있으시면 jun.ahn@hongik.ac.kr 으로 연락주시기 바랍니다.',
        keywords: 'DBCM, contact us, jun.ahn@hongik.ac.kr, DBCM Lab',
        author: 'SUNGHEE'
    } 
    return (
        <PageLayout PAGE_SEO={PAGE_SEO} home>
            <section className='container px-3 pb-10 md:pt-20 pt-[80px]'>
                <Text title className="!text-5xl !font-light">
                    Contact Us
                </Text>

                <div className="flex flex-wrap mt-8 justify-between">
                    <div className="md:w-1/2 w-full md:pl-2">
                        <Text p className="!text-lg leading-relaxed">
                            문의사항이 있으시면 아래로 연락주시기 바랍니다
                        </Text>
                        <address className="contact-info">
                            <strong>데이터 기반 건설관리 연구실</strong>
                            <br />
                            홍익대학교 건설환경공학과
                            <br />
                            제4공학관 T507
                            <br />
                            서울, 대한민국
                            <br />
                            <br />
                            <strong>Phone:</strong> <a href="tel:+82-2-320-1621">+82-2-320-1621</a>
                            <br />
                            <strong>Email:</strong>{' '}
                            <a href="mailto:jun.ahn@hongik.ac.kr">jun.ahn@hongik.ac.kr</a>
                        </address>
                    </div>
                    <div className="md:w-1/3 md:h-1/2 w-full">
                        <Text p>
                            write to us at
                        </Text>
                        <Text subtitle className="!font-light md:!text-3xl">
                            <a href="mailto:jun.ahn@hongik.ac.kr">jun.ahn@hongik.ac.kr</a>
                        </Text>
                    </div>
                </div>
            </section>


            <section className={"dark:bg-slate-800 bg-blue-100 mt-10 container py-10 md:px-20 px-5"}>
                <Text subtitle className="md:!text-5xl text-4xl !font-light">
                    Work with us . . .
                </Text>
                <Text p className="!text-lg leading-relaxed mt-5 px-1">
                    홍익대학교 DBCM Lab은 그래프 데이터베이스(GraphDB)와 데이터 사이언스를 활용하여 건설관리 및 안전 기술을 고도화하는 연구를 수행하고 있습니다.
                    본 연구 분야와 관련하여 공동 연구, 기술 협력 등 새로운 가치를 함께 만들어나갈 분들의 모든 연락을 환영합니다.
                </Text>
            </section>
        </PageLayout>
    )
}

export default ContactUs