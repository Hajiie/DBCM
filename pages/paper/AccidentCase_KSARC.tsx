/**These are necessary imports / components for the page */
import { PageLayout, Text, List, Image, LinkTo, Seperator, Slider } from "../../src/components";
import {ImageSize} from "../../src/shared/enums";

const Article = () => {
    return (
        // pass blogwithsidebar as show below for article page with sidebar layout
        <PageLayout blogcentered={true}>
            {/* Replace the below content with your content */}
            <p className="break-keep">
                The objective of this study is to construct and analyze a knowledge graph based on construction accident case data with the aim of enhancing the efficiency of information exploration and analysis.
                By meticulously organizing and graphically representing accident case data, the study devises a methodology for automated knowledge graph construction employing cutting-edge Al models and tools.
                The research automates data processing to handle the increasing data volume, with 23,877 accident cases from the Construction Safety Information (CSI) system.
                The knowledge graph clarifies complex data relationships, thereby enabling in-depth analysis of the causes of accidents and the formulation of preventive strategies.
                The study's key findings demonstrate the knowledge graph's ability to visualize semantic relationships, enhance decision-making efficiency, and enhance construction site safety by reducing accident frequency.
            </p>
            <div className='Infra Forum' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:'20px'}}>
                <Image src='/images/paperIMG/Alluvial Diagram.png' alt='img-1' size={ImageSize.MEDIUM}/>
            </div>
            <div className="px-4 py-3 dark:bg-slate-900 bg-blue-200 rounded mt-5 !text-lg leading-relaxed">
                <a href="https://www.ksarc.or.kr/publication/p-journal/detail/?master-check=&chk=33738&master-check=" target="_blank" rel="noopener noreferrer"><u><i>[한국건설자동화∙로보틱스학회] Journal of Construction Automation and Robotics, Vol.3 No.2(2024-06)</i></u></a><br />
                <a href="https://www.jcar.or.kr/articles/article/dPyD/#Information" target="_blank" rel="noopener noreferrer"><u><i>[한국건설자동화∙로보틱스학회] 건설 사고사례 데이터 기반 지식그래프 구축 및 분석: 한국 CSI 데이터베이스 사례</i></u></a>.
            </div>
            {/* Replace the above content with your content */}
        </PageLayout>
    )
}

export default Article;