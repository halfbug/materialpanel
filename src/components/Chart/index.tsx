/* eslint-disable import/prefer-default-export */
/* eslint-disable no-return-await */
import dynamic from 'next/dynamic';

export const Chart = dynamic(async () => await import('react-apexcharts'), { ssr: false });
