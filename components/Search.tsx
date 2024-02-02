'use client'

import axios from 'axios';
import { useCallback, useRef, useState } from 'react';

import rssParser from './RssParser';

const copyToClipboard = (value: string) => {
  navigator.clipboard.writeText(value);
};

const DataRow = ({ data }: any) => {
  const { label, labelValue, value } = data;

  if (value === undefined || value === '') {
    return <></>;
  }

  return (
    <div className="mt-1 w-full border-t pt-1">
      <div className="inline-flex items-center gap-x-3">
        <div
          id="hs-clipboard-basic"
          className="text-sm font-medium text-gray-800 dark:text-white"
        >
          <div className="text-gray-500">
            <span>{label}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(labelValue)}
              className="js-clipboard ml-2 inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white p-1 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              data-clipboard-target="#hs-clipboard-basic"
              data-clipboard-action="copy"
              data-clipboard-success-text="Copied"
            >
              <svg
                className="js-clipboard-default size-4 transition group-hover:rotate-6"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              </svg>

              <svg
                className="js-clipboard-success hidden size-4 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
          <div className="text-gray-800">
            <span>{value}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(value)}
              className="js-clipboard ml-2 inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white p-1 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              data-clipboard-target="#hs-clipboard-basic"
              data-clipboard-action="copy"
              data-clipboard-success-text="Copied"
            >
              <svg
                className="js-clipboard-default size-4 transition group-hover:rotate-6"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              </svg>

              <svg
                className="js-clipboard-success hidden size-4 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const rssBaseUrl = 'https://feeds.libsyn.com';
const showList = [
  {
    id: 253478,
    path: '/253478/rss',
    name: 'This Matters',
  },
  {
    id: 412859,
    path: '/412859/rss',
    name: "It's Political",
  },
  {
    id: 330650,
    path: '/330650/rss',
    name: 'Deep Left Field',
  },
  {
    id: 378203,
    path: '/378203/rss',
    name: 'Responsible Investing',
  },
  {
    id: 434604,
    path: '/434604/rss',
    name: 'The Paul Wells Show',
  },
  {
    id: 413639,
    path: '/413639/rss',
    name: 'The Billionaire Murders (Death in a Small Town)',
  },
  {
    id: 350786,
    path: '/350786/rss',
    name: 'Millennial Money',
  },
  {
    id: 378884,
    path: '/378884/rss',
    name: 'Between Us With Wes Hall',
  },
  {
    id: 336902,
    path: '/336902/rss',
    name: "Next Round's On Me",
  },
  {
    id: 413957,
    path: '/413957/rss',
    name: 'Footy Prime',
  },
  {
    id: 378533,
    path: '/378533/rss',
    name: 'First Generation',
  },
];

export default function Search() {
  const inputRef = useRef<any>('');
  const selectRef = useRef<any>('');
  const [cache, setCache] = useState<any>([]);
  const [result, setResult] = useState<any>([]);

  const searchFromCache = (data: any) => {
    const text = (inputRef.current?.value ?? '').toLowerCase();
    const r =
      data.items?.filter((item: any) => {
        return item.title?.toLowerCase().indexOf(text) !== -1;
      }) ?? [];
    setResult(r);
    return r;
  };

  const getPodcastsByArticleTitle = useCallback(async () => {
    try {
      if (selectRef.current?.value === '') {
        return;
      }

      searchFromCache(cache);

      // background update
      const { data } = await axios.get(
        `${rssBaseUrl}/${selectRef.current?.value}`,
      );
      const podcastData = await rssParser(data);
      setCache(podcastData);
      searchFromCache(podcastData);
    } catch (e) {
      console.log('>>>>>>> err', e);
    }
  }, [cache]);

  const pressEnterOnSearchInput = useCallback(
    (event: any) => {
      if (event.key === 'Enter') {
        console.log('enter press here! ');
        getPodcastsByArticleTitle();
      }
    },
    [getPodcastsByArticleTitle],
  );

  return (
    <>
      <div className="flex w-full">
        <div className="relative inline-block w-64">
          <select
            ref={selectRef}
            required
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none"
          >
            <option>Select a show</option>
            {showList.map((s: any, i: number) => (
              <option key={i} value={s.path}>{s.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="size-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            onKeyUp={(e) => pressEnterOnSearchInput(e)}
            ref={inputRef}
            className="rounded-s-gray-100 rounded-s-2 z-20 block w-full rounded-e-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500"
            placeholder="Search"
            required
          />
          <button
            onClick={getPodcastsByArticleTitle}
            className="absolute end-0 top-0 h-full rounded-e-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="size-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="w-full">
        {result?.map((r: any, i: number) => {
          return (
            <div key={i} className="text-m my-2 w-full overflow-hidden rounded border-4 border-indigo-200 border-l-indigo-500 border-t-indigo-700 p-2">
              <h2>{r.title}</h2>
              <DataRow
                data={{
                  label: 'Episode ID',
                  labelValue: 'episode_id',
                  value: r.guid,
                }}
              />
              <DataRow
                data={{
                  label: 'Episode Audio Url',
                  labelValue: 'episode_audio_url',
                  value: r.enclosures?.[0]?.url,
                }}
              />
              <DataRow
                data={{
                  label: 'Episode Duration',
                  labelValue: 'episode_duration',
                  value: r.duration,
                }}
              />
              <DataRow
                data={{
                  label: 'Episode Number',
                  labelValue: 'episode_no',
                  value: r.episode,
                }}
              />
              <DataRow
                data={{
                  label: 'Episode Season',
                  labelValue: 'episode_season',
                  value: r.season,
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
