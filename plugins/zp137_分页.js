import React from "react"
import css from "../css/zp137_分页.css"

const pageOption = [10, 20, 50, 100]
let icon = {}

function render(ref) {
    const p = ref.props
    if (!p.path || typeof p.path !== "string") return <div>请配置路径</div>
    const x = ref.excA("$c.x." + p.path)
    if (!x || !x.arr) return <div/>
    const cur = x.skip / x.limit
    const max = Math.ceil(x.count / x.limit)
    return <ul {...ref.rest}>
        <li onClick={() => go(ref, x, cur - 1)} title="上一页" className={"zp137-prev" + (x.skip ? "" : " zp137-disabled")}>{SVG.prev}</li>
        <li onClick={() => go(ref, x, 0)} className={"zp137-item" + (cur === 0 ? " zp137-active" : "")}><a>1</a></li>
        {cur - 3 > 0 && <li onClick={() => go(ref, x, cur > 5 ? cur - 5 : 0)} title="向前 5 页" className="zp137-jump-prev">{SVG.jumpPrev}</li>}
        {cur - 3 > 0 && <li onClick={() => go(ref, x, cur - 3)} className="zp137-item zp137-after-jump-prev"><a>{cur - 2}</a></li>}
        {cur - 2 > 0 && <li onClick={() => go(ref, x, cur - 2)} className="zp137-item"><a>{cur - 1}</a></li>}
        {cur - 1 > 0 && <li onClick={() => go(ref, x, cur - 1)} className="zp137-item"><a>{cur}</a></li>}
        {cur - 0 > 0 && max - cur > 1 && <li onClick={() => go(ref, x, cur)} className="zp137-item zp137-active"><a>{cur + 1}</a></li>}
        {max - cur > 2 && <li onClick={() => go(ref, x, cur + 1)} className="zp137-item"><a>{cur + 2}</a></li>}
        {max - cur > 3 && <li onClick={() => go(ref, x, cur + 2)} className="zp137-item"><a>{cur + 3}</a></li>}
        {max - cur > 4 && <li onClick={() => go(ref, x, cur + 3)} className="zp137-item zp137-before-jump-next"><a>{cur + 4}</a></li>}
        {max - cur > 3 && <li onClick={() => go(ref, x, cur + 5)} title="向后 5 页" className="zp137-jump-next">{SVG.jumpNext}</li>}
        {max > 1 && <li onClick={() => go(ref, x, max - 1)} className={"zp137-item" + (cur === max - 1 ? " zp137-active" : "")}><a>{max}</a></li>}
        <li onClick={() => go(ref, x, cur + 1)} title="下一页" className={"zp137-next" + (max - cur > 1 ? "" : " zp137-disabled")}>{SVG.next}</li>
        <li className="zp137-options">
            {p.pageSize && <select value={x.limit} onChange={e => changeSize(ref, x, e)} className="zinput" >
                {(pageOption.includes(x.limit) ? pageOption : [x.limit, ...pageOption]).map(a => <option value={a} key={a}>{a + " 条/页"}</option>)}
            </select>}
            {p.quickJumper && <div className="zp137-options-quick-jumper">跳至<input value={ref.input} onChange={e => {ref.input = parseInt(e.target.value); ref.render()}} onBlur={e => go(ref, x, ref.input - 1)} type="number"/>页</div>}
        </li>
    </ul>
}

function go(ref, x, idx) {
    if (idx < 0) idx = 0
    let O = JSON.parse(x.option)
    O.skip = x.limit * idx
    if (ref.input) ref.input = ""
    if (O.skip < x.count) search(ref, x, O)
}

function changeSize(ref, x, e) {
    let O = JSON.parse(x.option)
    O.limit = parseInt(e.target.value)
    O.skip = 0
    search(ref, x, O)
}

function search(ref, x, O) {
    ref.exc(`$${x.model}.search(x.path, Q, O, x.cache)`, { x, Q: JSON.parse(x.query), O }, () => {
        ref.exc("render()")
        if (ref.props.onPageChanged) ref.exc(ref.props.onPageChanged, Object.assign({}, ref.ctx, O), () => ref.exc("render()"))
    })
}

$plugin({
    id: "zp137",
    noContainer: true,
    props: [{
        prop: "path",
        type: "text",
        label: "路径",
        ph: "search()的第一个参赛"
    }, {
        prop: "pageSize",
        type: "switch",
        label: "显示pageSize切换器"
    }, {
        prop: "quickJumper",
        type: "switch",
        label: "可以快速跳转至某页"
    }, {
        prop: "onPageChanged",
        type: "exp",
        label: "onPageChanged"
    }],
    render,
    css
})

const SVG = {
    prev: <button className="zp137-item-link"><span className="zp137icon zp137icon-left"><svg viewBox="64 64 896 896"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg></span></button>,
    jumpPrev: <a className="zp137-item-link"><div className="zp137-item-container"><span className="zp137icon zp137icon-double-left zp137-item-link-icon"><svg viewBox="64 64 896 896"><path d="M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"></path></svg></span><span className="zp137-item-ellipsis">•••</span></div></a>,
    jumpNext: <a className="zp137-item-link"><div className="zp137-item-container"><span className="zp137icon zp137icon-double-right zp137-item-link-icon"><svg viewBox="64 64 896 896"><path d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 00188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 00492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"></path></svg></span><span className="zp137-item-ellipsis">•••</span></div></a>,
    next: <button className="zp137-item-link"><span className="zp137icon zp137icon-right"><svg viewBox="64 64 896 896"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path></svg></span></button>
}