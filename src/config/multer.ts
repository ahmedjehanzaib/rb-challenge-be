import * as multer from 'multer';
const uploadPath = './src/uploads';

const storage = multer.diskStorage({
	destination: (_req: any, _file: any, cb: any) => {
		cb(null, uploadPath);
	},
	filename: (_req: any, file: any, cb: any) => {
		let ext = '';
		if (file.originalname) {
			const extension_array = file.originalname.split('.');
			ext = extension_array[extension_array.length - 1];
		}
		const file_name = `service-${file.originalname.split('.')[0]}-${Date.now()}.${ext}`;
		cb(null, file_name);
	}
});

export const upload = multer({ storage: storage });