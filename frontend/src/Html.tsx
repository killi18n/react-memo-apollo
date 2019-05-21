import React from 'react';

function Html({ content, state, styleTags }: any) {
    console.log(styleTags);
    return (
        <html>
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__APOLLO_STATE__=${JSON.stringify(
                            state
                        ).replace(/</g, '\\u003c')};`,
                    }}
                />
            </body>
        </html>
    );
}

export default Html;
