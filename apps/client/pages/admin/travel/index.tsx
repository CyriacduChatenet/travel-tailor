import { GetServerSideProps, NextPage } from "next";
import { AccessToken, Travel, User } from "@travel-tailor/types";
import { TravelService, UserService } from "@travel-tailor/services";
import { ROUTES } from "@travel-tailor/constants";
import { SetStateAction, jwtDecode } from "@travel-tailor/functions";
import { Dispatch, useMemo, useState } from "react";
import { parse } from "cookie";
import { useRouter } from "next/navigation";

import { Layout } from "@/components/layout";
import { AuthChecker } from "@/components/auth/authChecker";
import { Paginator } from "@/components/paginator";
import { TravelTable } from "@/components/admin/travel-table";

interface IProps {
    data: Travel[];
    user: User;
}

const AdminDashboardTravelPage: NextPage<IProps> = ({ data, user }) => {
    const [page, setPage] = useState(1);
    const [response, setResponse] = useState<Travel[]>(data);
    const router = useRouter();
    const error = {};

    const handleCreate = async () => {
        return router.push(ROUTES.ADVERTISER.CREATE_ADVERTISER)
    }

    const handleFetch = async () => {
        const res = await TravelService.findAllTravels(`${process.env.NEXT_PUBLIC_API_URL}`, error, `?page=${page}&limit=10&sortedBy=DESC`);
        if (res) {
            setResponse(await res);
        }
    }

    useMemo(() => {
        if (page > 1) {
            handleFetch();
        }
    }, [page, user]);

    return (
        <AuthChecker>
            <Layout title={"About Us - Your Ultimate Travel Tailor for Tailored Adventures"} description={"Discover our innovative travel management platform that empowers you to curate personalized trips filled with activities based on your unique preferences. Explore the world like never before with our customizable journey planner."}>
                <main className="px-9 lg:px-32 min-h-screen grid grid-cols-4 md:grid-cols-8 xl:grid-cols-12 pt-20">
                    <section className="col-span-4 md:col-span-8 xl:col-span-12 pt-4 md:pt-8">
                        <h1 className="font-bold lg:text-2xl">Travel</h1>
                        <section className="my-8">
                            <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => handleCreate()}>Create</button>
                            <br />
                            <br />
                            <TravelTable data={response} setData={setResponse as Dispatch<SetStateAction<Travel[]>>}/>
                        </section>
                        <Paginator pageCurrent={page} setPage={setPage} limit={10} total={response.length} />
                    </section>
                </main>
            </Layout>
        </AuthChecker>
    );
};

export default AdminDashboardTravelPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    let error = {};
    let response = {};
    let user: Partial<User> = {}

    const cookies = req.headers.cookie;
    const parsedCookies = cookies ? parse(cookies) : {};
    const accessToken = parsedCookies.accessToken;
    const decodedToken = jwtDecode(accessToken) as AccessToken;

    if (accessToken) {
        user = await UserService.getUserByToken(`${process.env.API_URL}`, decodedToken.email, error);
        response = await TravelService.findAllTravels(`${process.env.NEXT_PUBLIC_API_URL}`, error, `?page=1&limit=10&sortedBy=DESC`);
    }
    return {
        props: {
            data: response,
            user
        }
    };
};