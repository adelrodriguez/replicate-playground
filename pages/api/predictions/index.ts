import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, negative_prompt } = req.body;

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/stable-diffussion/versions
      version: 'f178fa7a1ae43a9a9af01b833b9d2ecf97b1bcb0acfd2dc5dd04895e042863f1',

      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt, negative_prompt },
    }),
  });

  if (response.status !== 201) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  }

  const prediction = await response.json();
  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
