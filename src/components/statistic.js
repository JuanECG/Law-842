import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';

const Statsitics = (props) => {
  const [url] = useState('/api/statistic');

  useEffect(() => {
    getReports();
  }, [url]);

  async function getReports() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger text-center';
    const alertH = document.createElement('h4');
    alertH.textContent = 'No hay datos disponibles';
    alertDiv.appendChild(alertH);
    const REPORTS = await (
      await fetch('/api/statistic', {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      })
    ).json();
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
      new Chart(contextOpCh, {
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
      document.getElementById('operationsChart').after(alertDiv);
      document.getElementById('operationsChart').remove();
    }
    // Full searchs number
    const fullReport = REPORTS.operations.filter(
      (item) => item.category === 'TODO'
    );
    document.getElementById('fullSearchsNumber').innerHTML = fullReport.length;
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
      new Chart(contextTitCntCh, {
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
                  beginAtZero: true,
                  stepSize: 1
                }
              }
            ]
          }
        }
      });
    } else {
      document.getElementById('titleCountChart').after(alertDiv);
      document.getElementById('titleCountChart').remove();
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
      new Chart(contextChpCntCh, {
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
                  beginAtZero: true,
                  stepSize: 1
                }
              }
            ]
          }
        }
      });
    } else {
      document.getElementById('chapterCountChart').after(alertDiv);
      document.getElementById('chapterCountChart').remove();
    }
    // Article Count Chart
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
      new Chart(contextArtCntCh, {
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
                  beginAtZero: true,
                  stepSize: 1
                }
              }
            ]
          }
        }
      });
    } else {
      document.getElementById('articleCountChart').after(alertDiv);
      document.getElementById('articleCountChart').remove();
    }
    // Reports PDFs Count Chart
    let reportLoggedValue = 0;
    let reportUnLoggedValue = 0;
    REPORTS.reports.forEach((report) => {
      if (report.logged) reportLoggedValue += 1;
      else reportUnLoggedValue += 1;
    });
    document.getElementById('reportsNumber').innerHTML =
      reportLoggedValue + reportUnLoggedValue;
    if (reportLoggedValue || reportUnLoggedValue) {
      const contextRepCh = document
        .getElementById('reportsChart')
        .getContext('2d');
      new Chart(contextRepCh, {
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
      document.getElementById('reportsChart').after(alertDiv);
      document.getElementById('reportsChart').remove();
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
    document.getElementById('searchsNumber').innerHTML =
      searchAuthValue + searchNoAuthValue;
    if (searchAuthValue || searchNoAuthValue) {
      const contextSerCh = document
        .getElementById('searchsChart')
        .getContext('2d');
      new Chart(contextSerCh, {
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
      document.getElementById('searchsChart').after(alertDiv);
      document.getElementById('searchsChart').remove();
    }
  }

  if (props.isMainVisible) {
    return null;
  }

  return (
    <div className="content">
      <h1>Estadísticas del Sistema de Información</h1>
      <h2>
        Número de consultas de toda la ley: <span id="fullSearchsNumber"></span>
      </h2>
      <h2>Cantidad de operaciones realizadas:</h2>
      <canvas id="operationsChart"></canvas>
      <h2>Busqueda de Elementos de la ley por categoría:</h2>
      <h3>Títulos:</h3>
      <canvas id="titleCountChart"></canvas>
      <h3>Capítulos:</h3>
      <canvas id="chapterCountChart"></canvas>
      <h3>Artículos:</h3>
      <canvas id="articleCountChart"></canvas>
      <h2>
        Reportes generados (PDFs): <span id="reportsNumber"></span>
      </h2>
      <canvas id="reportsChart"></canvas>
      <h2>
        Busquedas realizadas: <span id="searchsNumber"></span>
      </h2>
      <canvas id="searchsChart"></canvas>
    </div>
  );
};

export default Statsitics;
