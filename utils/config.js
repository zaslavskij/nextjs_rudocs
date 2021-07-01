import dotenv from "dotenv";
dotenv.config();

const options = {
	translations: process.env.TRANSLATIONS,
	source: process.env.SOURCE,
};

export default options;
