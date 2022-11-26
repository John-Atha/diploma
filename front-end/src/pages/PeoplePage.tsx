import { Stack } from "@mui/material";
import {
  OneSecondaryEntity,
  placeholderSecondaryEntity,
} from "../components/general/OneSecondaryEntity";
import { SecondaryEntitiesList } from "../components/general/SecondaryEntitiesList";
import { SearchBar } from "../components/search/SearchBar";
import { PageSkeleton } from "./PageSkeleton";

export const PeoplePage = () => {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [total, setTotal] = useState(0);

  // if (searchParams.get("key") && searchParams.get("repo")) {
  //   return <OneRepository />
  // }

  return (
    <PageSkeleton
      children={
        <Stack spacing={2}>
          <SearchBar initValue="" placeholder="Search for a Person..." />
          <SecondaryEntitiesList
            name="People"
            component={<OneSecondaryEntity {...placeholderSecondaryEntity} />}
          />
        </Stack>
      }
    />
  );
};
