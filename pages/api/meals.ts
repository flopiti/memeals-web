//write the API route for scheduled meals, the GET method will return the list of scheduled meals, and the POST method will add a new scheduled meal to the list.

import { getAccessToken } from "@auth0/nextjs-auth0";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handleGetMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const { accessToken } = await getAccessToken(req, res);
  const response = await axios.get(`${process.env.BACKEND_URL}/meals`, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.status(200).json(response?.data);
};

const handlePostMethod = async (req: NextApiRequest, res: NextApiResponse) => {
  const { accessToken } = await getAccessToken(req, res);
  const response = await axios.post(
    `${process.env.BACKEND_URL}/meals`,
    req.body,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.status(200).json(response?.data);
};

const handler = (req: NextApiRequest, res: NextApiResponse<any[]>) => {
  switch (req.method) {
    case "GET":
      return handleGetMethod(req, res);
    case "POST":
      return handlePostMethod(req, res);
    default:
      return res.status(405).end();
  }
};
export default handler;
