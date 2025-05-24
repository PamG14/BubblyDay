import streamlit as st

st.set_page_config(page_title="BubblyDay", layout="centered")

st.title("🌈 BubblyDay")
st.subheader("Organizá tu día con burbujitas")

# Inicializar la lista de tareas si no existe
if "tasks" not in st.session_state:
    st.session_state.tasks = []

# Agregar nueva tarea
new_task = st.text_input("Escribí una tarea", "")
if st.button("Agregar") and new_task.strip():
    st.session_state.tasks.append(new_task.strip())

# Mostrar tareas
st.write("### Tareas del día")
for i, task in enumerate(st.session_state.tasks):
    col1, col2 = st.columns([8, 2])
    with col1:
        st.write(f"🔹 {task}")
    with col2:
        if st.button("❌", key=f"delete_{i}"):
            st.session_state.tasks.pop(i)
            st.experimental_rerun()
