import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { setRoutes } from "../redux/slices/breadCrumbSlice";
import { PageSkeleton } from "./PageSkeleton";

export interface GeneralItemPageProps {
  entityName: string;
  keyField: string | number;
  headerName: string;
}

export const GeneralItemPage = ({
  entityName,
  keyField,
  headerName,
}: GeneralItemPageProps) => {
  const dispatch = useAppDispatch();
  const { [keyField]: keyValue } = useParams();

  useEffect(() => {
    dispatch(
      setRoutes({
        routes: [
          {
            text: "MovieOn",
            href: "/",
          },
          {
            text: headerName,
            href: `/${entityName}`,
          },
          {
            text: keyValue,
            href: "#",
          },
        ],
      })
    );
  }, []);

  return (
    <PageSkeleton
      children={
        <div>
          {entityName} {keyValue}{" "}
        </div>
      }
    />
  );
};
