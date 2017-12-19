/**
 * @author Claudio Seitz
 * @version 1.0
 *
 * @param conf graph configuration
 * @param data graph data {nodes, edges}
 * @constructor
 */
function Graph(conf, data) {
    const width = conf.width;
    const height = conf.height;
    const zoom = conf.zoom;

    let scale = 1;
    let lod = 2;

    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);
    const viewport = svg.append('g');
    svg.call(d3.zoom()
        .scaleExtent([zoom[0], zoom[zoom.length - 1]])
        .on('zoom', () => {
            const e = d3.event.transform;
            viewport.attr('transform', e);
            if (scale !== e.k) {  //new scale
                scale = e.k;
                if (scale < zoom[lod]) {
                    lod--;
                    console.log(`scale: ${scale}\nlevel of detail: ${lod}`);
                    update(lod);
                } else if (scale >= zoom[lod + 1] && lod < zoom.length - 2) {
                    lod++;
                    console.log(`scale: ${scale}\nlevel of detail: ${lod}`);
                    update(lod);
                }
            }
        }));
    const tooltip = d3.select(".tooltip");
    const viewGraph = new ViewGraph(conf, data, viewport, tooltip);
    viewGraph.layout();


    const renderer = new Renderer(viewport, tooltip, conf, data);
    /*
     * Initializes the graph
     */
    renderer.initNodes(lod);
    renderer.initEdges(lod);

    /**
     * Updates the graph
     * Actually used for changed lod
     * @param lod level of detail
     */
    let update = (lod) => {
        renderer.updateNodes(lod);
        renderer.updateEdges(lod);
    };

}