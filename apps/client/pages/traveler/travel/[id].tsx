import React, { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { TravelService } from "@travel-tailor/services";
import { Travel } from "@travel-tailor/types";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";

import { AuthChecker } from "@/components/auth/authChecker";
const Mapbox: any = dynamic(
  () => import("@/components/map").then((mode) => mode.Mapbox),
  { loading: () => <div className="h-96 w-full" />, ssr: false }
);
import { DayNavbar } from "@/components/traveler/travels/dayNavbar";
import { ActivityList } from "@/components/traveler/travels/activity/activityList";
import { Layout } from "@/components/layout";
import { useHistory } from "@/../../packages/contexts/src";
import Link from "next/link";
import { ROUTES } from "@/../../packages/constants/src";

interface IProps {
  data: Travel;
}

const TravelerTravelPage: NextPage<IProps> = ({ data }) => {
  const [apiErrors, setApiErrors] = useState({});
  const [day, setDay] = useState<Date>(new Date());
  const [editorMode, setEditorMode] = useState<boolean>(false);
  const { setPathname } = useHistory();

  const handleValidateTravel = async () => {
    const response = await TravelService.updateTravel(
      `${process.env.NEXT_PUBLIC_API_URL}`,
      data.id,
      { validate: true },
      setApiErrors
    );
    if (response) {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (window) {
      setPathname(window.location.pathname);
      Cookies.set("travel_id", window.location.pathname.split("/")[3]);
    }
  }, []);
  return (
    <AuthChecker>
      <Layout
        title={
          "Create Your Dream Journey with Personalized Activities | Travel Tailor"
        }
        description={
          "Plan your perfect trip with our personalized travel planner. Explore a wide range of activities and create a customized itinerary tailored to your preferences. Discover new destinations, indulge in exciting adventures, and make lasting memories on your unique journey. Start planning today!"
        }
      >
        <main className="px-9 lg:px-32 min-h-screen grid grid-cols-4 md:grid-cols-8 xl:grid-cols-12 pt-20">
          <section className="col-span-4 md:col-span-8 xl:col-span-12 pt-4 md:pt-8">
            <h1 className="font-bold lg:text-2xl">
              {data.destinationCity} from{" "}
              {new Date(data.departureDate).toLocaleDateString("fr")} to{" "}
              {new Date(data.returnDate).toLocaleDateString("fr")}
            </h1>
            <section className="grid grid-cols-4 md:grid-cols-8 xl:grid-cols-12">
              <div className="col-span-4 md:col-span-4 xl:col-span-8">
                {!data.validate && (
                  <div className="lg:mt-8">
                    <button
                      className="rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                      onClick={() => handleValidateTravel()}
                    >
                      validate travel
                    </button>
                    <button
                      className={`rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mx-12 ${
                        editorMode
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-cyan-600 hover:bg-cyan-500"
                      }`}
                      onClick={() => setEditorMode(!editorMode)}
                    >
                      {editorMode ? "cancel" : "edit travel activities"}
                    </button>
                    <Link href={`${ROUTES.TRAVELER.TRAVEL.EDIT}/${window.location.pathname.split("/")[3]}`}>
                      <button className="rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600">
                        edit travel
                      </button>
                    </Link>
                  </div>
                )}
                <DayNavbar days={data.days} dayCurrent={day} setDay={setDay} />
                <ActivityList
                  days={data.days}
                  dayCurrent={day}
                  editorMode={editorMode}
                />
              </div>
              <div className="col-span-4 md:col-span-4 xl:col-span-4 hidden md:block">
                <Mapbox
                  mapboxApiAccessToken={`${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
                  addresse={data.destinationCity}
                />
              </div>
            </section>
          </section>
        </main>
      </Layout>
    </AuthChecker>
  );
};

export default TravelerTravelPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const error = {};

  const response = await TravelService.findTravelById(
    `${process.env.API_URL}`,
    String(context?.params?.id),
    error
  );
  return {
    props: {
      data: response,
    },
  };
};
