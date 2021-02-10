$.ajax({
  headers: {
    'auth-token':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDE0N2U4MzdlY2MwYTJmNWE4MzU4NDUiLCJpYXQiOjE2MTI4NDg3Mzd9.KD84rUBSDSGzyyFPvseJ_fFb6Jg0zzQT6mmPX3qJAIg'
  },
  type: 'GET',
  url: '/api/statistic'
})
  .done(async (REPORTS) => {
    // Operations Chart
    let searchOpValue = 0;
    let insertOpValue = 0;
    let updateOpValue = 0;
    let deleteOpValue = 0;
    REPORTS.operations.forEach((report) => {
      switch (report.type) {
        case 'SEARCH':
          searchOpValue += 1;
          break;
        case 'INSERT':
          insertOpValue += 1;
          break;
        case 'UPDATE':
          updateOpValue += 1;
          break;
        case 'DELETE':
          deleteOpValue += 1;
          break;
        default:
          break;
      }
    });
    if (searchOpValue || insertOpValue || updateOpValue || deleteOpValue) {
      const contextOpCh = document
        .getElementById('operationsChart')
        .getContext('2d');
      const operationChart = new Chart(contextOpCh, {
        type: 'pie',
        data: {
          labels: ['Busqueda', 'Inserción', 'Actualización', 'Eliminación'],
          datasets: [
            {
              label: 'Operaciones',
              data: [
                searchOpValue,
                insertOpValue,
                updateOpValue,
                deleteOpValue
              ],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(255, 99, 132, 0.2)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 2
            }
          ]
        }
      });
    } else {
      $('#operationsChart')
        .parent()
        .append(
          "<div class='alert alert-danger text-center'><h4>No hay datos disponibles</h4></div>"
        );
      $('#operationsChart').remove();
    }
    // Full searchs number
    const fullReport = REPORTS.operations.filter(
      (item) => item.category === 'TODO'
    );
    $('#fullSearchsNumber').text(fullReport.length);
    // Title Count Chart
    const fullTitles = await (await fetch('/api/list/TÍTULO')).json();
    const titilesReport = REPORTS.operations.filter(
      (item) => item.category === 'TÍTULO'
    );
    const titlesArray = {};
    titilesReport.forEach((report) =>
      report.data.forEach((title) => {
        if (!titlesArray[title]) titlesArray[title] = { count: 1 };
        else titlesArray[title].count += 1;
      })
    );
    for (const item of Object.keys(titlesArray)) {
      const title = fullTitles.find((title) => title._id === item);
      titlesArray[item].name = title.title;
    }
    const titlesNames = [];
    const titlesCounts = [];
    Object.values(titlesArray).forEach((title) => {
      if (title.name) {
        titlesNames.push(title.name);
        titlesCounts.push(title.count);
      }
    });
    if (titlesNames.length) {
      const contextTitCntCh = document
        .getElementById('titleCountChart')
        .getContext('2d');
      const titleCountChart = new Chart(contextTitCntCh, {
        type: 'horizontalBar',
        data: {
          labels: titlesNames,
          datasets: [
            {
              label: '# de Busquedas',
              data: titlesCounts,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    } else {
      $('#titleCountChart')
        .parent()
        .append(
          "<div class='alert alert-danger text-center'><h4>No hay datos disponibles</h4></div>"
        );
      $('#titleCountChart').remove();
    }

    // Chapter Count Chart
    const fullChapters = await (await fetch('/api/list/CAPÍTULO')).json();
    const chaptersReport = REPORTS.operations.filter(
      (item) => item.category === 'CAPÍTULO'
    );
    const chaptersArray = {};
    chaptersReport.forEach((report) =>
      report.data.forEach((chapter) => {
        if (!chaptersArray[chapter]) chaptersArray[chapter] = { count: 1 };
        else chaptersArray[chapter].count += 1;
      })
    );
    for (const item of Object.keys(chaptersArray)) {
      const chapter = fullChapters.find((chapter) => chapter._id === item);
      chaptersArray[item].name = chapter.title;
    }
    const chaptersNames = [];
    const chaptersCounts = [];
    Object.values(chaptersArray).forEach((chapter) => {
      if (chapter.name) {
        chaptersNames.push(chapter.name);
        chaptersCounts.push(chapter.count);
      }
    });
    if (chaptersNames.length) {
      const contextChpCntCh = document
        .getElementById('chapterCountChart')
        .getContext('2d');
      const chapterCountChart = new Chart(contextChpCntCh, {
        type: 'horizontalBar',
        data: {
          labels: chaptersNames,
          datasets: [
            {
              label: '# de Busquedas',
              data: chaptersCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    } else {
      $('#chapterCountChart')
        .parent()
        .append(
          "<div class='alert alert-danger text-center'><h4>No hay datos disponibles</h4></div>"
        );
      $('#chapterCountChart').remove();
    }
    // Chapter Count Chart
    const fullArticles = await (await fetch('/api/list/ARTÍCULO')).json();
    const articlesReport = REPORTS.operations.filter(
      (item) => item.category === 'ARTÍCULO'
    );
    const articlesArray = {};
    articlesReport.forEach((report) =>
      report.data.forEach((article) => {
        if (!articlesArray[article]) articlesArray[article] = { count: 1 };
        else articlesArray[article].count += 1;
      })
    );
    for (const item of Object.keys(articlesArray)) {
      const article = fullArticles.find((article) => article._id === item);
      if (article) articlesArray[item].name = article.title;
    }
    const articlesNames = [];
    const articlesCounts = [];
    Object.values(articlesArray).forEach((article) => {
      if (article.name) {
        articlesNames.push(article.name);
        articlesCounts.push(article.count);
      }
    });
    if (articlesNames.length) {
      const contextArtCntCh = document
        .getElementById('articleCountChart')
        .getContext('2d');
      const articleCountChart = new Chart(contextArtCntCh, {
        type: 'horizontalBar',
        data: {
          labels: articlesNames,
          datasets: [
            {
              label: '# de Busquedas',
              data: articlesCounts,
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    } else {
      $('#articleCountChart')
        .parent()
        .append(
          "<div class='alert alert-danger text-center'><h4>No hay datos disponibles</h4></div>"
        );
      $('#articleCountChart').remove();
    }
    // Reports PDFs Count Chart
    let reportLoggedValue = 0;
    let reportUnLoggedValue = 0;
    REPORTS.reports.forEach((report) => {
      if (report.logged) reportLoggedValue += 1;
      else reportUnLoggedValue += 1;
    });
    $('#reportsNumber').text(reportLoggedValue + reportUnLoggedValue);
    if (reportLoggedValue || reportUnLoggedValue) {
      const contextRepCh = document
        .getElementById('reportsChart')
        .getContext('2d');
      const reportsChart = new Chart(contextRepCh, {
        type: 'pie',
        data: {
          labels: ['Usuario autenticado', 'Usuario no autenticado'],
          datasets: [
            {
              data: [reportLoggedValue, reportUnLoggedValue],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 206, 86, 0.2)'
              ],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 2
            }
          ]
        }
      });
    } else {
      $('#reportsChart')
        .parent()
        .append(
          "<div class='alert alert-danger text-center'><h4>No hay datos disponibles</h4></div>"
        );
      $('#reportsChart').remove();
    }
    // Auth / No Auth user search Chart
    const searchsReport = REPORTS.operations.filter(
      (item) => item.type === 'SEARCH'
    );
    let searchAuthValue = 0;
    let searchNoAuthValue = 0;
    searchsReport.forEach((report) => {
      if (report.logged) searchAuthValue += 1;
      else searchNoAuthValue += 1;
    });
    $('#searchsNumber').text(searchAuthValue + searchNoAuthValue);
    if (searchAuthValue || searchNoAuthValue) {
      const contextSerCh = document
        .getElementById('searchsChart')
        .getContext('2d');
      const searchsChart = new Chart(contextSerCh, {
        type: 'pie',
        data: {
          labels: ['Usuario autenticado', 'Usuario no autenticado'],
          datasets: [
            {
              data: [searchAuthValue, searchNoAuthValue],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 206, 86, 0.2)'
              ],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 2
            }
          ]
        }
      });
    } else {
      $('#searchsChart')
        .parent()
        .append(
          "<div class='alert alert-danger text-center'><h4>No hay datos disponibles</h4></div>"
        );
      $('#searchsChart').remove();
    }
  })
  .fail((jqXHR) => console.log(jqXHR));
