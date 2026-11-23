import { iArticle } from "../../shared/interfaces"
import FeaturedArticle from "../ArticleCards/FeaturedArticle"
import Seperator from "../Seperator"
import Text from "../Text"

const FeaturedArticleSection = ({ articles }: { articles: iArticle[] }) => {
    const featureArticles = articles.filter((article) => article.featureArticle)
    return (

        featureArticles.length ?
            (<>
                <Text subtitle className="mb-5 md:!text-4xl text-3xl w-full px-3 !font-medium">
                    Featured Articles
                </Text>
                <hr className='border-1 mb-5 w-[98%] mx-auto' />

                {
                    featureArticles.map((each) => (
                        <FeaturedArticle article={each.preview} path={each.path} key={each.path} />
                    ))
                }

                <Seperator />
            </>) : null
    )
}

export default FeaturedArticleSection