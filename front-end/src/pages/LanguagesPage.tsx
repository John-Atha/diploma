import {
    OneSecondaryEntity,
    placeholderSecondaryEntity,
  } from "../components/general/OneSecondaryEntity";
  import { SecondaryEntitiesList } from "../components/general/SecondaryEntitiesList";
  import { PageSkeleton } from "./PageSkeleton";
  
  export const LanguagesPage = () => {
    // const [searchParams, setSearchParams] = useSearchParams();
    // const [total, setTotal] = useState(0);
  
    // if (searchParams.get("key") && searchParams.get("repo")) {
    //   return <OneRepository />
    // }
  
    return (
      <PageSkeleton
        children={
          <SecondaryEntitiesList
            name="Languages"
            component={<OneSecondaryEntity {...placeholderSecondaryEntity} />}
          />
        }
      />
    );
  };
  