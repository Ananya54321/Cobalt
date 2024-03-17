

import { connect } from "@/dbConfig/dbConfig";
import checkSessionExistenceServerSide from "@/helpers/checkSessionExistenceServerSide";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { getTokensToken } from "@/helpers/getTokensToken";
import Login from "@/models/loginModel";
import Snippet from "@/models/snippetModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function GET(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const snippets = await Snippet.find({userId:userId})
            const response = NextResponse.json({
                message:'sessions found',
                snippets: snippets,
            })
            
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
