import 'dotenv/config';

import { app } from '@/app';

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
