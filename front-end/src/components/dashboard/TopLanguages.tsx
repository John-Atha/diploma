import React, { useEffect, useState } from 'react'
import { getReposByLang } from '../../api/repos';
import { langs } from '../../data/langs';
import { DiagramPaper } from './DiagramPaper';

export const TopLanguages = () => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        let data: any = {};
        langs.forEach(async (lang: string) => {
            // try {
            //     const resp = await getReposByLang({
            //         lang,
            //         page: 1,
            //         per_page: 1,
            //     });
            //     console.log(resp.total_count);
            //     data[lang] = resp?.total_count;
            // }
            // catch (err) {
            //     console.log(err);
            // }
            data[lang] = Math.round(Math.random()*100000)
        })
        
        setStats(data);
    }, [])

    if (Object.keys(stats).length) {
        return (
            <DiagramPaper
                title="Top Languages"
                keys={Object.keys(stats||{})}
                values={Object.values(stats||{})}
                id="top-langs-global"
                type="pie"
                isLoading={false}
                showAllKeys={true}
                chartWidth={400}
            />
        )
    }
    return null;
}