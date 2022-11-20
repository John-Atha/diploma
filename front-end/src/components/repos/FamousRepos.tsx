import { useQuery } from "react-query"
import { queriesKeys } from "../../api/queriesKeys"
import { getFamousRepos } from "../../api/repos"
import { CarouselResults } from "../general/CarouselResults"
import { OneRepo } from "./OneRepo"

export const FamousRepos = () => {
    const { data, isLoading } = useQuery(
        queriesKeys['getFamousRepos'],
        () => getFamousRepos({ limit: 10 }), {
            cacheTime: 100000,
            refetchOnWindowFocus: false,
        }
    )

    return (
        <CarouselResults
            data={data?.items}
            isLoading={isLoading}
            width={"70vw"}
            title="Most starred repos"
            oneResultComponent={
                <OneRepo
                    keywordsLim={0}
                    descriptionLim={30}
                    height={175}
                    width={250}
                />
            }
        />
    )
}