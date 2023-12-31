import { Storage } from "@google-cloud/storage";
import { writeAsyncIterableToWritable } from "@remix-run/node";

export const uploadImage = async (
  filename: string,
  data: AsyncIterable<Uint8Array>,
  timestamp: string,
): Promise<string> => {
  const bucketName = process.env.BUCKET_NAME || "";

  const formattedFilename = `${timestamp}_${filename.replace(
    // eslint-disable-next-line no-useless-escape
    /[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/\s]/g,
    "_",
  )}`;

  const gcpPrivateKey = `
-----BEGIN PRIVATE KEY-----
${process.env.GCP_PRIVATE_KEY?.split(String.raw`\n`).join("\n")}
-----END PRIVATE KEY-----
`;

  /*
    THIS COMMENTED-OUT SECTION IS USED FOR LOCAL TESTING

    In hosted environments (stage, preflight, production),
    the @google-cloud/storage package will automatically
    use the credentials provided by the environment. However,
    when running locally, we need to provide the credentials.
    These credentials are based on a service account that
    has been granted access to the bucket.
  */
  const cloudStorage = new Storage({
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: gcpPrivateKey,
    },
    projectId: process.env.GCP_PROJECT_ID,
  });
  // const cloudStorage = new Storage();
  const file = cloudStorage.bucket(bucketName).file(formattedFilename);
  const fileStream = file.createWriteStream();

  await writeAsyncIterableToWritable(data, fileStream);

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${formattedFilename}`;

  return publicUrl;
};

export const deleteImage = async (filename: string) => {
  const bucketName = process.env.BUCKET_NAME || "";

  const gcpPrivateKey = `
-----BEGIN PRIVATE KEY-----
${process.env.GCP_PRIVATE_KEY?.split(String.raw`\n`).join("\n")}
-----END PRIVATE KEY-----
`;

  /*
    THIS COMMENTED-OUT SECTION IS USED FOR LOCAL TESTING

    In hosted environments (stage, preflight, production),
    the @google-cloud/storage package will automatically
    use the credentials provided by the environment. However,
    when running locally, we need to provide the credentials.
    These credentials are based on a service account that
    has been granted access to the bucket.
  */
  const cloudStorage = new Storage({
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key: gcpPrivateKey,
    },
    projectId: process.env.GCP_PROJECT_ID,
  });
  // const cloudStorage = new Storage();

  await cloudStorage.bucket(bucketName).file(filename).delete();
};
