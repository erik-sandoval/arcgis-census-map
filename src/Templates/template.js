import axios from 'axios'

const key = "f71397456f83bd9ef4afa2721a6cafb4b3e9d010"
const baseUrl = "https://api.census.gov/data/2013/language?get=LANLABEL,LAN7,EST"

export const state = {
    title: "{NAME}",
    content: function (feature) {
        const state = feature.graphic.attributes.STATE
        const dataPromise = axios.get(`${baseUrl}&for=state:${state}&key=${key}`).then(res => {
            const data = res.data

            return `
        <table>
          <tr>
            <th>Language</th>
            <th>Estimate</th>
          </tr>
          ${data.map((censusInfo, i) => (
                `${i !== 0 ? `<tr> <td className="label">${censusInfo[0]}</td>
          <td>${censusInfo[2]}</td>
          </tr>` : ""}`
            ))}
        </table>`
        })

        return dataPromise
    },
}

export const county = {
    title: "{NAME}",
    content: function (feature) {
        const state = feature.graphic.attributes.STATE
        const county = feature.graphic.attributes.COUNTY
        const dataPromise = axios.get(`${baseUrl}&for=county:${county}&in=state:${state}&key=${key}`).then(res => {
            const data = res.data

            if (data) {
                return `
        <table>
          <tr>
            <th>Language</th>
            <th>Estimate</th>
          </tr>
          ${data.map((censusInfo, i) => (
                    `${i !== 0 ? `<tr> <td class="label">${censusInfo[0]}</td>
          <td>${censusInfo[2]}</td>
          </tr>` : ""}`
                ))}
        </table>`
            } else {
                return "No census data to show for {NAME}"
            }
        })

        return dataPromise
    }
}