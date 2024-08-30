import React from "react"
import css from "./zp137_分页.css"

const pageOption = [10, 20, 50, 100]
let icon = {}

function render(ref) {
    const p = ref.props
    if (!p.path || typeof p.path !== "string") return ref.isDev ? <div>请配置数据路径</div> : ""
    const x = ref.excA(p.path.startsWith("$c.x") ? p.path : "$c.x." + p.path)
    if (!x || !x.limit || !x.arr) return <div/>
    const cur = x.skip / x.limit
    const max = Math.ceil(x.count / x.limit)
    return <div {...ref.rest}>
        <span onClick={() => go(ref, x, cur - 1)} title="上一页" className={x.skip ? "ztoL" : "ztoL zp137disabled"}></span>
        <span onClick={() => go(ref, x, 0)} className={cur === 0 ? " zp137active" : ""}>1</span>
        {cur - 3 > 0 && <i onClick={() => go(ref, x, cur > 5 ? cur - 5 : 0)} title="向前 5 页" className="zp137jump prev"><i className="ztoR2 zhover"/><span>•••</span></i>}
        {cur - 3 > 0 && <span onClick={() => go(ref, x, cur - 3)}>{cur - 2}</span>}
        {cur - 2 > 0 && <span onClick={() => go(ref, x, cur - 2)}>{cur - 1}</span>}
        {cur - 1 > 0 && <span onClick={() => go(ref, x, cur - 1)}>{cur}</span>}
        {cur - 0 > 0 && max - cur > 1 && <span onClick={() => go(ref, x, cur)} className="zp137active">{cur + 1}</span>}
        {max - cur > 2 && <span onClick={() => go(ref, x, cur + 1)}>{cur + 2}</span>}
        {max - cur > 3 && <span onClick={() => go(ref, x, cur + 2)}>{cur + 3}</span>}
        {max - cur > 4 && <span onClick={() => go(ref, x, cur + 3)}>{cur + 4}</span>}
        {max - cur > 5 && <i onClick={() => go(ref, x, cur + 5)} title="向后 5 页" className="zp137jump next"><i className="ztoR2 zhover"/><span>•••</span></i>}
        {max > 1 && <span onClick={() => go(ref, x, max - 1)} className={cur === max - 1 ? " zp137active" : ""}>{max}</span>}
        <span onClick={() => go(ref, x, cur + 1)} title="下一页" className={max - cur > 1 ? "ztoR" : "ztoR zp137disabled"}></span>
        <div className="zp137options">
            {p.pageSize && <select value={x.limit} onChange={e => changeSize(ref, x, e)} className="zinput" >
                {(pageOption.includes(x.limit) ? pageOption : [x.limit, ...pageOption]).map(a => <option value={a} key={a}>{a + " 条/页"}</option>)}
            </select>}
            {p.quickJumper && <div>跳至<input className="zinput" value={ref.input} onChange={e => {ref.input = parseInt(e.target.value)}} onBlur={e => go(ref, x, ref.input - 1)} type="number"/>页</div>}
        </div>
    </div>
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
        label: "数据路径",
        ph: "search()的第一个参赛"
    }, {
        prop: "pageSize",
        type: "switch",
        label: "显示【每页显示条数】切换器"
    }, {
        prop: "quickJumper",
        type: "switch",
        label: "可以快速跳转至某页"
    }, {
        prop: "onPageChanged",
        type: "exp",
        label: "翻页表达式"
    }],
    render,
    css
})

const SVG = {
}