import got from "got";

// Call web service and return count user, (got is library to call url)
async function getCountUsers() {
  return {
    total: await got
      .get("https://my-webservice.moveecar.com/users/count")
      .json(),
  };
}

// Add total from service with 20
async function computeResult() {
  const result = await getCountUsers();
  return result.total + 20;
}
