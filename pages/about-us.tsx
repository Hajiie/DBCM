/**These are necessary imports / components for the page */
import { ImageSize, TextAlign, ListType } from "../src/shared/enums";
import { PageLayout, Text, List, Image, LinkTo, Seperator, Slider } from "../src/components";
import { CURRENT_YEAR } from "../src/constants/appConstants";
import { iSEO } from "../src/shared/interfaces";

const AboutUs = () => {
    const PAGE_SEO: iSEO = {
        title: 'About Us',
        description: `홍익대학교 DBCM Lab`,
        keywords: 'DBCM, contact us, Hongik University, DBCM Lab',
        author: 'SUNGHEE'
    }
    return (
        <PageLayout PAGE_SEO={PAGE_SEO} home>
            <section className='container px-3 md:pb-20 md:pt-10 pt-20'>
                <div className="">
                    <LinkTo href="/" passHref className="block md:w-[20%] w-[50%] ">
                        <Image src="/images/DBCM_logo.png" alt="DBCM Lab" className="rounded-lg overflow-hidden" />
                    </LinkTo>
                    <Text title className='mb-5 mt-10 dark:text-sky-400 text-sky-600'>
                        홍익대학교 DBCM Lab
                    </Text>
                    <Text subtitle className='text-xl mb-5'>
                        그래프DB 기반 데이터사이언스 기법의 적용을 통한 건설관리 및 건설안전 기술개발 연구실
                    </Text>

                    <Text p className='text-lg break-keep'>
                        건설관리는 건설환경공학 분야에서 건설 프로젝트의 전 생애주기에 걸쳐 사업계획, 설계, 시공, 운영과 유지보수까지의 관리 활동을 의미합니다.
                        건설관리의 목적은 건설 프로젝트를 적절하게 관리하여 품질, 시간, 비용, 안전 측면의 목표를 달성하는 것입니다.<br />
                        Construction management refers to the management activities for the entire life cycle of a construction project, from planning and design, through construction, operation, and maintenance.
                        The purpose of construction management is to properly manage a construction project to achieve quality, time, cost, and safety goals.<br /><br />
                        인공지능 기술이 발전하면서 공학분야 융합의 중요성이 대두되고 있는 현재, 건설관리 및 건설안전 분야에서도 인공지능과 융합을 필두로 전통적인 건설관리 기법들에 혁신적 변화가 일어나고 있습니다.<br />
                        The development of artificial intelligence (AI) has brought new opportunities to all engineering fields.
                        Construction project management and construction safety have been able to move beyond the traditional mode to intelligence by integrating AI technologies.<br /><br />
                        홍익대학교 DBCM연구실은 그래프DB 기반 데이터사이언스 기법의 적용을 통한 건설관리 및 건설안전 기술개발 연구에 집중하고 있습니다.
                        새로운 기술 개발 뿐만 아니라 기존 기술의 개선을 통해 건설업계의 효율성과 안정성을 극대화 할수 있는 과학기술 개발 및 이를 통한 건설산업에 대한 긍정적 기여를 목표로 합니다.<br />
                        The DBCM Lab at Hongik University focuses on innovative graph DB-based construction management and construction safety research.
                        Combining multiple AI-related techniques, we aim to support the construction industry and the full lifecycle of construction projects such that efficiency, productivity, and safety are maximized throughout the full lifecycle of construction projects.<br /><br />
                    </Text>

                    <div className="flex flex-wrap justify-between">
                        {/* "Features"를 "주요 연구 분야"로 변경하여 연구실 성격을 명확히 함 */}
                        <div className="md:w-auto w-full my-5">
                            <Text subtitle className='text-3xl font-medium'>
                                주요 연구 분야 (Features)
                            </Text>
                            <List type={ListType.disc}>
                                <li>그래프DB 기반 건설 데이터 분석<br />(Graph DB-based Construction Data Analysis)</li>
                                <li>AI 기반 건설 공정 및 안전 관리<br />(AI-based Construction Management & Safety)</li>
                                <li>건설 프로젝트 전 생애주기 최적화<br />(Full Lifecycle Optimization for Projects)</li>
                                <li>데이터사이언스 기반 리스크 예측<br />(Data Science-driven Risk Prediction)</li>
                                <li>건설 산업 디지털 전환 기술 개발<br />(Digital Transformation for Construction)</li>
                            </List>
                        </div>

                        {/* "Philosophy"를 연구실의 가치에 맞게 수정 */}
                        <div className="md:w-auto w-full my-5">
                            <Text subtitle className='text-3xl font-medium'>
                                연구 철학 (Philosophy)
                            </Text>
                            <List type={ListType.disc}>
                                <li>데이터 기반의 문제 해결<br />(Data-Driven Problem Solving)</li>
                                <li>산업 현장 기여 중심 연구<br />(Industry-Oriented Research)</li>
                                <li>안전과 효율성의 극대화<br />(Maximization of Safety & Efficiency)</li>
                                <li>전통과 혁신 기술의 융합<br />(Convergence of Tradition & Innovation)</li>
                            </List>
                        </div>

                        {/* "Requirements"를 연구실에 필요한 "핵심 역량"으로 재해석 */}
                        <div className="md:w-auto w-full my-5">
                            <Text subtitle className='text-3xl font-medium'>
                                핵심 역량 (Core Competencies)
                            </Text>
                            <List type={ListType.disc}>
                                <li>건설관리 및 건설 공학 지식<br />(Construction Management & Engineering)</li>
                                <li>데이터 분석 및 프로그래밍<br />(Data Analysis & Programming)</li>
                                <li>그래프 데이터베이스 활용 능력<br />(Graph Database Proficiency)</li>
                                <li>AI/머신러닝 모델링 역량<br />(AI/Machine Learning Modeling)</li>
                            </List>
                        </div>
                    </div>
                    <Seperator />
                    <div className="px-4 py-3 dark:bg-slate-800 bg-blue-200 rounded my-5 text-center">
                        <Text p className="!text-lg leading-relaxed mb-0">
                            문의 사항이 있다면 <LinkTo href="/pages/about-us.tsx">Contact Us</LinkTo> 혹은 아래로 연락주시기 바랍니다.<br />
                            <a href="mailto:jun.ahn@hongik.ac.kr">jun.ahn@hongik.ac.kr</a><br/>
                            <a href="mailto:ok122800@gmail.com">ok122800@gmail.com</a>
                        </Text>
                    </div>
                </div>
            </section>
        </PageLayout>
    )
}

export default AboutUs