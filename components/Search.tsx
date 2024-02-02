'use client'

import axios from 'axios';
import { useCallback, useRef, useState } from 'react';

import rssParser from './RssParser';

const copyToClipboard = (value: string, id: any) => {
  navigator.clipboard.writeText(value);
  console.log('>>>>>>>> id, value', id, value)
  const textEle = document.getElementById(id)
  if (textEle) {
    textEle.style.display = "inline-block";
    setTimeout(() => textEle.style.display = "none", 1000)
  }

};

const DataRow = ({ data }: any) => {
  const { label, labelValue, value, i } = data;

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
              onClick={(e) => copyToClipboard(labelValue, `copy-title-${labelValue}-${i}`)}
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
              <span className="text-xs" style={{display: 'none', color: 'red'}} id={`copy-title-${labelValue}-${i}`}>Copied</span>
            </button>
          </div>
          <div className="text-gray-800">
            <span>{value}</span>
            <button
              type="button"
              onClick={(e) => copyToClipboard(value, `copy-value-${labelValue}-${i}`)}
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
              <span className="text-xs" style={{display: 'none', color: 'red'}} id={`copy-value-${labelValue}-${i}`}>Copied</span>
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
  const [loading, setLoading] = useState(false)

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

      setLoading(true)
      searchFromCache(cache);

      const { data } = await axios.get(
        `${rssBaseUrl}/${selectRef.current?.value}`,
      );
      const podcastData = await rssParser(data);
      setCache(podcastData);
      searchFromCache(podcastData);
    } catch (e) {
      console.log('>>>>>>> err', e);
      alert('Error searching podcasts, please try again')
    } finally {
      setLoading(false)
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
            onChange={() => setResult([])}
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
        {loading && (
          <div role="status" className="flex w-full text-center items-center pt-10">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"/>
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"/>
            </svg>
          </div>
        )}
        {!loading && result?.map((r: any, i: number) => {
          return (
            <div key={i} className="text-m my-2 w-full overflow-hidden rounded border-4 border-indigo-200 border-l-indigo-500 border-t-indigo-700 p-2">
              <h2 className="text-xl">{r.title}</h2>
              <DataRow
                data={{
                  label: 'Episode ID',
                  labelValue: 'episode_id',
                  value: r.guid,
                  i
                }}
              />
              <DataRow
                data={{
                  label: 'Episode Audio Url',
                  labelValue: 'episode_audio_url',
                  value: r.enclosures?.[0]?.url,
                  i
                }}
              />
              <DataRow
                data={{
                  label: 'Episode Duration',
                  labelValue: 'episode_duration',
                  value: r.duration,
                  i
                }}
              />
              <DataRow
                data={{
                  label: 'Episode Number',
                  labelValue: 'episode_no',
                  value: r.episode,
                  i
                }}
              />
              <DataRow
                data={{
                  label: 'Episode Season',
                  labelValue: 'episode_season',
                  value: r.season,
                  i
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
