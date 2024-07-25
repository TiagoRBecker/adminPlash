
import Orders from "@/components/Orders/";
import Chart from "@/components/Orders/chart";
import Google from "@/components/Analitcs";
import MagazineMostViews from "@/components/mostViews/magazines";
import ArticleMostViews from "@/components/mostViews/articles";
import CoverOfMonth from "@/components/EventCoverOfMonth";
import LastEmployees from "@/components/Employees";
import LastUsers from "@/components/Users";
import { Suspense } from "react";
import Events from "@/components/Events";
import Dvl from "@/components/Dvls/index";
import Loading from "@/components/Spinner";
import Comission from "@/components/Comission";

const Dashboard = async () => {
  return (
 <Suspense fallback={<Loading/>}>
<section className="container mx-auto h-full  flex  flex-col items-center  px-4 gap-4  bg-white  rounded-sm p-2">

    <Orders/>
    <Chart />
    <div className="w-full flex flex-col md:flex-row gap-5">
      <div className="w-full flex flex-col md:w-1/2">
        <CoverOfMonth />
        <Events />
      </div>
      <div className="w-full flex flex-col md:w-1/2">
        <LastEmployees />
        <LastUsers />
      </div>
    </div>
    <div className="w-full">
      <Google />
    </div>
    <div className="w-full flex flex-col md:flex-row gap-5">
      <div className="w-full flex flex-col md:w-1/2">
        <MagazineMostViews />
        <ArticleMostViews />
      </div>
      <div className="w-full flex flex-col md:w-1/2">
      <Dvl/>
      <Comission />
      </div>
    </div>
  </section>
  </Suspense>
 
  );
};

export default Dashboard;
