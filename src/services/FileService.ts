import { AuthenticatedAdapter } from '../AuthenticatedAdapter';
import { File } from '../types';

export class FileService {
	constructor(protected readonly adapter: AuthenticatedAdapter) {}

	/**
	 * Get a file by it's upload ID.
	 * @see https://devdocs.magento.com/marketplace/eqp/v1/files.html#get-a-file-upload
	 * @example eqp.getFileService().getFile('1');
	 */
	getFile(uploadId: string, offset?: number, limit?: number): Promise<File> {
		return this.adapter.get(`/files/uploads/${uploadId}`, { params: { offset, limit } });
	}
}
